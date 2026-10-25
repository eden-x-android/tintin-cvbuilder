---
name: css-conventions
description: CSS naming, biến, đơn vị và inline-style convention cho project tintin-cvbuilder-edenx — tách 2 vùng: UI app (neobrutalism) và mẫu CV (đúng px theo thiết kế)
---

# CSS Conventions

Project có **2 vùng style độc lập**, không được trộn biến/class của vùng này sang vùng kia:

| Vùng | Phạm vi | Nguồn thiết kế |
|---|---|---|
| **UI app** | topbar, form, nút, panel, trang login | Neobrutalism của repo `auto-content` (`web/src/app/globals.css`) |
| **Mẫu CV** | trang A4 được preview/in | Bản export thiết kế trong `asset/*.html` (xem `cv-templates.md`) |

## Class naming
- Kebab-case cho mọi class (`form-item`, `btn-accent`). Không dùng BEM (`block__element--modifier`) — khi port class từ auto-content thì đổi `.btn--accent` → `.btn-accent`, `.topbar__sub` → `.topbar-sub`.
- Class của mẫu CV có tiền tố `cv-` (`cv-page`, `cv-section-title`) để không đụng class UI app.

## Biến màu / spacing
- **UI app:** mọi màu và giá trị lặp lại khai báo qua CSS custom property trong `Global.css` (`--accent`, `--ink`, `--paper`, `--ground`, `--line`, `--border-w`, `--shadow`, ...), giữ đúng giá trị của auto-content. Không hardcode hex ở file CSS khác; cần màu mới thì thêm biến vào `Global.css` trước.
- **Mẫu CV:** màu theme (`accent`, `soft`, `line`, `ink`, ...) và font theme được set thành biến `--cv-*` qua inline style trên root của trang CV (giá trị động theo preset). CSS của mẫu chỉ dùng `var(--cv-accent)`, không hardcode màu theme. Màu xám trung tính cố định của thiết kế (`#36363b`, `#6b6b70`, ...) được phép giữ nguyên hex trong CSS của mẫu để khớp thiết kế.

## Đơn vị
- **UI app:** `rem` cho typography và spacing; `px` chỉ cho border, box-shadow; `%` cho layout tỉ lệ.
- **Mẫu CV:** giữ **đúng px** như bản thiết kế (trang `794px × 1123px` = A4 ở 96dpi, padding `52px 56px`, font `11.5px`, `13.5px`, ...). Không quy đổi sang rem — sai lệch làm lệch ngắt trang khi in.

## Inline style vs class
- Inline style (`style={{...}}`) chỉ dùng cho giá trị **động, phụ thuộc state/props** (biến `--cv-*` của theme, opacity khi kéo-thả).
- Mọi styling tĩnh (không đổi theo state) phải đưa vào class CSS, kể cả khi chỉ dùng ở một chỗ. Markup thiết kế gốc dùng inline style — khi port sang React phải chuyển phần tĩnh thành class.

## Tổ chức file & print
- Biến toàn cục, reset, `@font-face` đặt ở `Global.css`, import một lần ở `main.tsx`.
- Font tự host trong `public/fonts/` (lấy từ bản export thiết kế), không phụ thuộc Google Fonts lúc in.
- Mỗi component có file CSS riêng cùng tên, import ngay trong file component đó (xem `file-organization.md`).
- In: `@page { size: A4; margin: 0 }`; dùng `@media print` theo pattern `.no-print` (ẩn UI app khi in), `.page-break` (ngắt trang), `break-inside: avoid` cho block không được cắt đôi. Khi in phải bỏ box-shadow của trang CV.
