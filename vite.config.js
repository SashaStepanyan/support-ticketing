import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from "@vitejs/plugin-vue";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
        vue(),
        laravel({
            input: ["resources/css/app.css", "resources/js/app.js"],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            vue: "vue/dist/vue.esm-bundler.js",
        },
    },
    server: {
        hmr: {
            host: "0.0.0.0",
        },
        port: 5173,
        host: true,
    },
    build: {
        publicDir: 'public',
    },
});
