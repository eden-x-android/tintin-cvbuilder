import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// App chính. Trang login build riêng bằng vite.login.config.ts (xem file đó).
// Khi `npm run dev`, Vite cũng phục vụ luôn login/index.html tại /login/.
export default defineConfig({
    plugins: [react(), tailwindcss()],
});
