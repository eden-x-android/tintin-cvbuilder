// Gọi /api/request-otp và /api/verify-otp (netlify/functions/). Trả về status + body, không throw khi HTTP lỗi.

export type ApiResult = {
    status: number;
    data: { ok?: boolean; error?: string; retryAfter?: number; attemptsLeft?: number };
};

const postJson = async (url: string, body: unknown): Promise<ApiResult> => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
};

export const requestOtp = (username: string) => postJson('/api/request-otp', { username });

export const verifyOtp = (username: string, otp: string) => postJson('/api/verify-otp', { username, otp });
