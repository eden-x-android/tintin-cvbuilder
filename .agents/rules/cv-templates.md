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
- Logic `renderVals()` port thành hàm thuần `buildCvView` — giữ đúng hành vi: bỏ giá trị rỗng/`null`/mảng rỗng, ghép `startDate – endDate` bằng en dash, đánh số project `01, 02, ...`, meta project `Platform · OS · SDLC`, contact LinkedIn bỏ `https://www.` và `/` cuối, Location tách khỏi lưới contact.
- Ảnh: slot `88×88px`, bo góc `10px`, lấy từ data URL trong `CvData`; ẩn khi `showPhoto = false` hoặc chưa có ảnh.
- Cờ hiển thị giữ nguyên tên và mặc định của thiết kế: `showPhoto`, `showReferences`, `showOverview` (đều `true`).
- Sau khi port, đối chiếu bằng screenshot headless Chrome cạnh bản export gốc (cùng dữ liệu mẫu) trước khi coi là xong.

## Font — phải đúng file của bản export
- Tự host woff2 lấy từ manifest của bundle vào `public/fonts/`, khai báo `@font-face` trong `Global.css` với **đúng** `font-weight`, `font-style`, `unicode-range` như bundle. Bắt buộc có subset `vietnamese`.
- Chỉ lấy các face mà bundle có — không tự thêm weight. Bundle có:
  - Manrope 400–800
  - Archivo 400–700
  - Mulish 400–700
  - Cormorant Garamond chỉ có 500, 500 italic, 600. Tiêu đề `700` của P1d trong bản gốc được render bằng face 600; thêm face 700 sẽ làm lệch thiết kế.
- Subset `cyrillic`/`greek` có thể bỏ (CV chỉ tiếng Việt/Anh) — giữ `latin`, `latin-ext`, `vietnamese`.
