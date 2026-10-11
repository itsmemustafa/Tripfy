import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const serverDir = path.join(repoDir, "server");
const clientDir = path.join(repoDir, "client", "myapp");
const nodemonEntry = path.join(repoDir, "node_modules", "nodemon", "bin", "nodemon.js");
const viteEntry = path.join(repoDir, "node_modules", "vite", "bin", "vite.js");
const children = [];
let shuttingDown = false;

const isPortOpen = (port) =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host: "localhost", port });
    const finish = (open) => {
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(500);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });

const isApiReady = async () => {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/v1/health", {
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch {
    return false;
  }
};

const terminateTree = (child) => {
  if (!child?.pid || child.exitCode !== null) return;
  if (process.platform === "win32") {
    spawnSync("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
  } else {
    child.kill("SIGTERM");
  }
};

const stop = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) terminateTree(child);
  process.exit(exitCode);
};

const launch = (entry, args, cwd, label) => {
  const child = spawn(process.execPath, [entry, ...args], {
    cwd,
    stdio: "inherit",
  });
  children.push(child);
  child.once("error", (error) => {
    console.error(`Failed to start ${label}: ${error.message}`);
    stop(1);
  });
  child.once("exit", (code, signal) => {
    if (!shuttingDown) {
      console.error(`${label} stopped (${signal || `exit ${code}`}).`);
      stop(code || 1);
    }
  });
  return child;
};

const waitForApi = async () => {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (await isApiReady()) return true;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
};

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());

const [apiAlreadyRunning, clientAlreadyRunning] = await Promise.all([
  isApiReady(),
  isPortOpen(5173),
]);

if (apiAlreadyRunning && clientAlreadyRunning) {
  console.log("Tripfy is already running at http://localhost:5173");
  process.exit(0);
}

if (apiAlreadyRunning || clientAlreadyRunning) {
  console.error(
    `Cannot start cleanly: port ${apiAlreadyRunning ? "3000" : "5173"} is already in use. Stop the old Tripfy terminal and run npm run dev again.`
  );
  process.exit(1);
}

console.log("Starting Tripfy API...");
launch(nodemonEntry, ["app.js"], serverDir, "API");

if (!(await waitForApi())) {
  console.error("API did not become ready. Check the MongoDB service and server/.env.local.");
  stop(1);
}

console.log("API ready. Starting Tripfy client...");
launch(viteEntry, [], clientDir, "Client");
