import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RouteErrorBoundary from "./pages/Errors/RouteErrorBoundary";
import NotFound from "./pages/Errors/NotFound";

const Landing = lazy(() => import("./pages/Landing/Landing"));
const Places = lazy(() => import("./pages/Places/Places"));
const PlaceDetails = lazy(() => import("./pages/PlaceDetails/PlaceDetails"));
const Plan = lazy(() => import("./pages/Plan/Plan"));
const Admin = lazy(() => import("./pages/Admin/Admin"));
const MyPlans = lazy(() => import("./pages/MyPlans/MyPlans"));
const PlanDetailsView = lazy(() => import("./pages/PlanDetails/PlanDetails"));
const PlanDetailsEditor = lazy(() => import("./pages/PlanDetails/PlanDetailsPage"));
const MapPage = lazy(() => import("./pages/Map/Map"));
const AIPlanner = lazy(() => import("./pages/AIPlanner/AIPlanner"));
const SharedPlanView = lazy(() => import("./pages/SharedPlan/SharedPlanView"));


const withSuspense = (element) => (
  <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading page...</div>}>
    {element}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: withSuspense(<Landing />),
      },
      {
        path: "places",
        element: withSuspense(<Places />),
      },
      {
        path: "place/:id",
        element: withSuspense(<PlaceDetails />),
      },
      {
        path: "map",
        element: withSuspense(<MapPage />),
      },
      {
        path: "plan",
        element: withSuspense(<Plan />),
      },
      {
        path: "plan/edit/:id",
        element: withSuspense(<Plan />),
      },
      {
        path: "ai-planner",
        element: withSuspense(<AIPlanner />),
      },
      {
        path: "my-plans",
        element: withSuspense(<MyPlans />),
      },
      {
        path: "my-plans/:id",
        element: withSuspense(<PlanDetailsView />),
      },
      {
        path: "plan/:planId",
        element: withSuspense(<PlanDetailsEditor />),
      },
      {
        path: "shared/plan/:planId",
        element: withSuspense(<SharedPlanView />),
      },
      {
        path: "admin",
        element: withSuspense(<Admin />),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
