import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/theme.css';
import LoginPage from './LoginPage';

// Bundle riêng của trang login (vite.login.config.ts) — không import gì từ app ngoài theme.
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LoginPage />
    </StrictMode>,
);
