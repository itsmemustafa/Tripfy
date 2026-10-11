import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
            },
            '/uploads': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: {
            'mapbox-gl': 'maplibre-gl',
        },
    },
    optimizeDeps: {
        include: ['react-map-gl', 'maplibre-gl'],
    },
})
