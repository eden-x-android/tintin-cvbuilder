---
name: file-organization
description: Quy tắc tổ chức thư mục, đặt tên file và vị trí asset tĩnh cho project tintin-cvbuilder-edenx
---

# File & Folder Organization

## Cấu trúc `src/`
```
src/
  main.tsx                # entry point, chỉ import Global.css ở đây
  App.tsx / App.css       # root component, giữ state CvData + app shell
  Global.css              # reset, @font-face, CSS variables UI app (:root)
  types/
    cv.ts                 # schema CvData — nguồn duy nhất của shape dữ liệu
  data/
    sampleCv.ts           # dữ liệu mặc định khi chưa import
  templates/
    presets.ts            # THEMES, FONTS và 3 preset P1a / P1c / P1d
  utils/
    validateCv.ts         # unknown → CvData | lỗi, dùng khi import JSON
    buildCvView.ts        # CvData → view-model cho mẫu (port renderVals)
    cvIds.ts              # gán / bỏ id nội bộ khi import / export
  components/
    CvForm.tsx / CvForm.css
    CvPreview.tsx / CvPreview.css
    AtsTemplate.tsx / AtsTemplate.css
```
- Component con luôn đặt trong `components/`, không đặt lẫn ở `src/` gốc.
- `src/` gốc chỉ chứa `main.tsx`, `App.tsx`, `App.css`, `Global.css` và các thư mục ở trên. Thư mục mới chỉ thêm khi có ít nhất 1 file thật cần đến.
- File chỉ chứa type/hằng/hàm thuần dùng đuôi `.ts`; chỉ file có JSX mới dùng `.tsx`.

## Server-side & login (ngoài `src/`)
```
netlify/
  edge-functions/auth-gate.js   # chặn mọi request khi chưa có cookie phiên
  functions/
    _lib/session.js              # helper dùng chung (không phải function)
    request-otp.js / verify-otp.js / logout.js   # /api/*
public/login/                    # trang login: HTML + JS/CSS thuần
```
- `netlify/` giữ **JavaScript** (port nguyên từ cv-by-html), không nằm trong `tsconfig` của app. Không chuyển sang TS trừ khi người dùng yêu cầu.
- `public/login/` là **ngoại lệ có chủ đích** với react-conventions: trang login phải tải được khi bundle app (đã bị gate) chưa được phép tải, nên không dùng React/Vite. Biến màu trong `login.css` là bản sao của `Global.css` — sửa palette thì sửa cả hai.
- Helper dùng chung giữa các function đặt trong `netlify/functions/_lib/` (thư mục bắt đầu bằng `_` và không có file trùng tên nên Netlify không deploy nó thành function).

## Bản thiết kế gốc (`asset/`)
- `asset/CV P1a.html`, `CV P1c.html`, `CV P1d.html` là bản export thiết kế — **nguồn tham chiếu, chỉ đọc**. Không sửa, không import vào app, không serve ra ngoài (không nằm trong `public/`).
- Cách đọc/giải nén xem `cv-templates.md`. File giải nén để tham chiếu đặt ở scratchpad, không commit.

## Co-location CSS
- Mỗi component có file CSS **cùng tên**, đặt cùng thư mục với component, import trực tiếp trong file component đó:
  ```tsx
  // components/CvPreview.tsx
  import './CvPreview.css';
  ```
- Không gộp style của nhiều component vào một file CSS chung.

## Asset tĩnh (ảnh, font)
- Đặt trong `public/images/` và `public/fonts/`, tham chiếu bằng đường dẫn tuyệt đối từ root: `/images/...`, `/fonts/...`.
- Ảnh đại diện người dùng upload **không** lưu thành file — lưu dạng data URL trong `CvData` để đi kèm file JSON export.
- Không đặt asset dùng trong app vào `src/assets/` trừ khi asset đó cần qua Vite build pipeline (import trực tiếp trong TS/CSS để hash tên file).

## File naming
- Component: PascalCase, trùng tên component (`CvForm.tsx`). Viết tắt 2 chữ cái trở lên vẫn chỉ hoa chữ đầu (`Cv`, không phải `CV`).
- Util/hook/type: camelCase (`buildCvView.ts`, `useCvData.ts`, `cv.ts`).
- CSS file: trùng tên với component/module mà nó style.
