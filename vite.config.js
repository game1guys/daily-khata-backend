import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { spaDevRoot } from './vite-plugins/spaDevRoot.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode, command }) => {
    const env = { ...process.env, ...loadEnv(mode, __dirname, '') };

    const viteBackendUrl =
        env.VITE_BACKEND_URL ||
        (command === 'serve' ? 'http://127.0.0.1:8000' : '');

    return {
        plugins: [
            spaDevRoot(),
            laravel({
                input: [
                    'resources/css/app.css',
                    'resources/js/app.js',
                    'resources/js/daily-khata-web/main.tsx',
                ],
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/js/daily-khata-web'),
            },
        },
        define: {
            'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
                env.VITE_SUPABASE_URL || env.SUPABASE_URL || ''
            ),
            'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
                env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || ''
            ),
            'import.meta.env.VITE_BACKEND_URL': JSON.stringify(viteBackendUrl),
        },
        server: {
            watch: {
                ignored: ['**/storage/framework/views/**'],
            },
        },
    };
});
