---
name: css-conventions
description: Styling convention cho project tintin-cvbuilder-edenx — UI app dùng HeroUI v3 + Tailwind v4, mẫu CV dùng CSS thuần đúng px theo thiết kế
---

# CSS / Styling Conventions

Project có **2 vùng style độc lập**, không được trộn biến/class của vùng này sang vùng kia:

| Vùng | Phạm vi | Công cụ |
|---|---|---|
| **UI app** | header, toolbar, form, picker, trang login | HeroUI v3 component + Tailwind v4 utility |
| **Mẫu CV** | trang A4 được preview/in (`AtsTemplate`) | CSS thuần trong `AtsTemplate.css`, theo bản export `asset/*.html` (xem `cv-templates.md`) |

## UI app (HeroUI + Tailwind)
- Dùng component HeroUI trước (Button, TextField, Select, Switch, Accordion, Card, Popover, Drawer, Alert...). Chỉ tự dựng khi HeroUI không có (vd: `MonthYearPicker` vì DatePicker của HeroUI chọn tới ngày).
- Styling bằng Tailwind utility trong `className`. Không viết file CSS riêng cho component UI, trừ phần Tailwind không diễn đạt gọn được (vd: vạch ngắt trang trong `CvPreview.css`).
- Màu dùng token ngữ nghĩa của HeroUI (`bg-accent`, `text-muted`, `bg-surface`, `border-separator`, `text-danger`...), không hardcode hex trong TSX. Đổi màu thì sửa biến trong `src/theme.css`.
- **Palette:** vàng chanh `--lime: #cfff04` làm `--accent` (nút chính, trạng thái đang chọn, switch bật), chữ trên nền vàng luôn đen (`--accent-foreground`). Viền focus dùng màu mực (`--focus`) vì vàng chanh không đủ tương phản trên nền sáng. App luôn ở light theme (`class="light"` trên `<html>`).
- Font UI: `font-sans` = Be Vietnam Pro, `font-display` = Archivo cho tiêu đề.
- In: ẩn UI bằng `print:hidden`, các khung bọc preview reset bằng `print:*` utility.

## Mẫu CV (CSS thuần)
- Class có tiền tố `cv-`, kebab-case (`cv-page`, `cv-section-title`).
- Màu theme (`accent`, `soft`, `line`, `tint`, `ink`) và font theme được set thành biến `--cv-*` qua inline style trên `.cv-page` (giá trị động theo preset). CSS của mẫu chỉ dùng `var(--cv-accent)`..., không hardcode màu theme. Màu xám trung tính cố định của thiết kế (`#36363b`, `#6b6b70`, ...) giữ nguyên hex để khớp thiết kế.
- Giữ **đúng px** như bản thiết kế (trang `794px × 1123px` = A4 ở 96dpi, padding `52px 56px`, font `11.5px`, `13.5px`, ...). Không quy đổi sang rem, không dùng Tailwind class trong mẫu.
- `.cv-page` tự reset font/line-height/letter-spacing vì Tailwind preflight và body của app set khác. Sau mọi thay đổi ở theme/preflight, đối chiếu screenshot với bản export.
- Inline style trong mẫu chỉ cho biến `--cv-*`. Markup thiết kế gốc dùng inline style — khi port phải chuyển phần tĩnh thành class.

## Font & print
- Mọi `@font-face` ở `src/Fonts.css` (import trong `src/theme.css`). Font tự host trong `public/fonts/` (font mẫu CV lấy từ bản export, font UI lấy từ Google Fonts), không phụ thuộc Google Fonts lúc chạy/in.
- In: `@page { size: A4; margin: 0 }`; `break-inside: avoid` cho block không được cắt đôi, `break-after: avoid` cho tiêu đề section, `.cv-break-before` / `.cv-break-after` cho ngắt trang chủ động. Trang CV dùng `box-decoration-break: clone` để padding lặp lại ở mỗi trang A4, và bỏ box-shadow khi in.
