---
name: cv-templates
description: Nguồn thiết kế, preset và quy tắc port 3 mẫu CV P1a / P1c / P1d sang React — phải khớp thiết kế, đúng font
---

# CV Templates (P1a / P1c / P1d)

## Nguồn thiết kế
- Source of truth là 3 file export trong `asset/` (`CV P1a.html`, `CV P1c.html`, `CV P1d.html`), thiết kế gốc là `CV QA R.dc.html` trên claude.ai/design.
- Mỗi file là **bundle**: HTML thật nằm trong `<script type="__bundler/template">` (chuỗi JSON), asset (font woff2, JS runtime) nằm trong `<script type="__bundler/manifest">` (JSON `uuid → {mime, compressed, data base64}`, `compressed` = gzip). Template tham chiếu asset bằng uuid.
- Markup dùng runtime riêng (`<sc-for>`, `<sc-if>`, `<image-slot>`, `{{ }}`, class `Component extends DCLogic` với `renderVals()`) — **không chạy runtime này trong app**, chỉ đọc để port.
- Đọc bằng script Python giải nén vào scratchpad, chạy với `python3 -I`. Không commit file giải nén.

## Cả 3 file là cùng một component
Chỉ khác giá trị mặc định. Đều dùng layout **Clean (ATS)** + phần cuối **Phương án 1 · Bảng thống nhất** (`footer = 1`: Education, Certifications, References chung một lưới — tiêu đề trái, các dòng năm + tên bên phải).

| Preset | Theme | accent | Font head / body |
|---|---|---|---|
| `P1a` | Cobalt | `#2346b0` | Manrope / Manrope |
| `P1c` | Ink (đen trắng) | `#1d1d1f` | Archivo / Archivo |
| `P1d` | Forest | `#22513f` | Cormorant Garamond / Mulish |

- Bảng màu đầy đủ của mỗi theme (`accent`, `soft`, `line`, `border`, `tint`, `dot`, `ink`) copy **nguyên giá trị** từ object `THEMES` trong bundle vào `src/templates/presets.ts`. Chỉ port 3 theme trên — không port layout `log`, footer 0/2/3, hay 8 theme/7 font còn lại trừ khi người dùng yêu cầu.

## Quy tắc port
- Port markup ATS 1:1: giữ thứ tự section (header → contacts → SUMMARY → OBJECTIVE → SKILLS → RELEVANT EXPERIENCE → PROJECTS → footer phương án 1), giữ nguyên text tiêu đề tiếng Anh in hoa, mọi kích thước px, gap, letter-spacing, line-height, màu xám trung tính.
- Trang: `794px × min-height 1123px`, padding `52px 56px`, nền trắng, box-shadow chỉ hiện trên màn hình. In: `@page { size: A4; margin: 0 }`.
- Logic `renderVals()` port thành hàm thuần `buildCvView` — giữ đúng hành vi: bỏ giá trị rỗng/`null`/mảng rỗng, ghép `startDate – endDate` bằng en dash (tháng in dạng `June 2024`), contact LinkedIn bỏ `https://www.` và `/` cuối, Location tách khỏi lưới contact.
- Link trên CV (contact, email reference, link nhúng trong text) dùng chung kiểu highlight `.cv-link` của thiết kế: chữ `#2a2a2e`, không gạch chân, dải `tint` của theme cao 42% ở chân chữ, hover phủ kín.
- Ảnh: slot `88×88px`, bo góc `10px`, lấy từ data URL trong `CvData`; chưa có ảnh thì ẩn.
- Không port các cờ `showPhoto` / `showReferences` / `showOverview` của thiết kế: mục nào có dữ liệu thì hiện, không có thì ẩn (người dùng đã chốt).
- Sau khi port, đối chiếu bằng screenshot headless Chrome cạnh bản export gốc (cùng dữ liệu mẫu) trước khi coi là xong.

## Font — phải đúng file của bản export
- Tự host woff2 lấy từ manifest của bundle vào `public/fonts/`, khai báo `@font-face` trong `src/Fonts.css` với **đúng** `font-weight`, `font-style`, `unicode-range` như bundle. Bắt buộc có subset `vietnamese`.
- Chỉ lấy các face mà bundle có — không tự thêm weight. Bundle có:
  - Manrope 400–800
  - Archivo 400–700
  - Mulish 400–700
  - Cormorant Garamond chỉ có 500, 500 italic, 600. Tiêu đề `700` của P1d trong bản gốc được render bằng face 600; thêm face 700 sẽ làm lệch thiết kế.
- Subset `cyrillic`/`greek` có thể bỏ (CV chỉ tiếng Việt/Anh) — giữ `latin`, `latin-ext`, `vietnamese`.
- Font là variable: nhiều weight trỏ chung một file woff2, nhưng vẫn khai báo từng weight riêng như bundle (không gộp thành dải `400 800`, sẽ mở khoá weight bundle không có).

## Khác biệt có chủ đích so với bản export (đã chốt với người dùng)
- Ô ảnh chỉ hiện khi đã có ảnh (bản export luôn hiện placeholder "Ảnh" vì là công cụ thiết kế).
- Section/dòng rỗng bị ẩn thay vì hiện tiêu đề trống hoặc dấu ` · ` thừa.
- Dòng thời gian công việc **bỏ location** (thiết kế có `· location`): chỉ `June 2024 – Present`.
- PROJECTS là section độc lập (schema `projects` riêng), **không** in tên công ty bên phải tên dự án.
- Dòng meta dự án nối mọi cặp key-value người dùng nhập (`Key: Value  ·  Key: Value`), không cố định Platform/OS/SDLC.
- Dự án có nhãn **"Responsibilities:"** (kiểu giống "Result:") phía trên danh sách công việc.
- Link nhúng `[chữ](url)` trong text dài render bằng `.cv-link`.
- In: tiêu đề section không treo cuối trang (`break-after: avoid`), padding lặp lại mỗi trang (`box-decoration-break: clone`), ngắt trang chủ động theo section (`sectionBreaks`) và theo job/dự án (`pageBreakAfter`).
