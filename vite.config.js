import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'logo-oficial.png', 'robots.txt'],
            manifest: {
                name: 'Mister Churras Chronicles',
                short_name: 'Mister Churras',
                description: 'O Mestre da Brasa virtual para rituais de churrasco perfeitos.',
                theme_color: '#F4ECD8',
                background_color: '#F4ECD8',
                display: 'standalone',
                icons: [
                    {
                        src: 'assets/logo-oficial.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'assets/logo-oficial.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'assets/logo-oficial.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
});
