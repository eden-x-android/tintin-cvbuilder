import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Trang login là bundle React riêng, mọi file nằm dưới /login/ — đường dẫn mà
// netlify/edge-functions/auth-gate.js cho qua khi chưa đăng nhập. Không dùng chung
// chunk với app chính, nên bundle app ở /assets/ vẫn bị chặn hoàn toàn.
export default defineConfig({
    root: fileURLToPath(new URL('./login', import.meta.url)),
    base: '/login/',
    // Font lấy từ /fonts/ của app chính (gate cũng cho qua), không copy public/ lần nữa.
    publicDir: false,
    plugins: [react(), tailwindcss()],
    build: {
        outDir: fileURLToPath(new URL('./dist/login', import.meta.url)),
        emptyOutDir: true,
    },
});
