import type { ReactNode } from 'react';

// Link nhúng trong text dạng [chữ](url) — cú pháp mà nút 🔗 của RichTextArea chèn vào.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

// Chỉ cho phép giao thức an toàn, để file JSON import không chèn được javascript: vào CV.
const SAFE_HREF = /^(https?:|mailto:|tel:)/i;

export const normalizeHref = (url: string): string => {
    const trimmed = url.trim();
    return SAFE_HREF.test(trimmed) ? trimmed : `https://${trimmed}`;
};

// Đổi text có link thành node React (không chèn HTML thô). `linkClassName` để mỗi nơi tự style link.
export const renderRichText = (text: string, linkClassName: string): ReactNode[] => {
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    for (const match of text.matchAll(LINK_PATTERN)) {
        const [full, label, url] = match;
        const index = match.index ?? 0;
        if (index > lastIndex) nodes.push(text.slice(lastIndex, index));
        nodes.push(
            SAFE_HREF.test(url) ? (
                <a key={index} className={linkClassName} href={url} target="_blank" rel="noreferrer">
                    {label}
                </a>
            ) : (
                label
            )
        );
        lastIndex = index + full.length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
};
