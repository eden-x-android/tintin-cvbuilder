---
name: file-organization
description: Quy tắc tổ chức thư mục, đặt tên file và vị trí asset tĩnh cho project tintin-cvbuilder-edenx
---

# File & Folder Organization

## Cấu trúc `src/`
```
src/
  main.tsx                # entry app, chỉ import theme.css ở đây
  App.tsx                 # root component, giữ state CvData + settings, app shell
  theme.css               # entry CSS: tailwindcss + @heroui/styles + Fonts.css + override theme
  Fonts.css               # mọi @font-face (generated, xem cv-templates.md)
  types/
    cv.ts                 # schema CvData — nguồn duy nhất của shape dữ liệu
  data/
    sampleCv.ts           # CV giả mặc định khi chưa có nháp (không dùng dữ liệu thật)
    emptyItems.ts         # item trống cho nút "Thêm" trong form
  templates/
    presets.ts            # THEMES, FONTS và 3 preset P1a / P1c / P1d
  hooks/
    useMediaQuery.ts
  utils/
    validateCv.ts         # unknown → CvData | lỗi, dùng khi import JSON / đọc nháp
    buildCvView.ts        # CvData → view-model cho mẫu (port renderVals)
    richText.tsx          # render [chữ](url) thành link (không chèn HTML thô)
    dates.ts              # "YYYY-MM" ↔ "June 2024"
    cvIds.ts              # tạo id nội bộ, export JSON bỏ id
    draftStorage.ts       # tự lưu nháp vào localStorage (tiện ích, không thay Export)
    listOps.ts / hasValue.ts / resizePhoto.ts
  components/
    CvForm.tsx            # form tổng (Accordion), ghép các component dưới
    FormSection / ItemCard / IconActions / AddButton / PageBreakSwitch
    TextInput / RichTextArea / LinkButton / StringListField / StringListRow
    MonthYearPicker / PeriodGrid / MetaEditor / PhotoField
    JobEditor / ProjectEditor
    CvPreview.tsx / .css  # thu nhỏ trang cho vừa cột + vạch ngắt trang
    AtsTemplate.tsx / .css  # mẫu CV (P1a/c/d dùng chung, khác preset) — CSS thuần
```
- Component con luôn đặt trong `components/`, không đặt lẫn ở `src/` gốc.
- File chỉ chứa type/hằng/hàm thuần dùng đuôi `.ts`; file có JSX dùng `.tsx`.
- Component UI không có file CSS riêng (dùng Tailwind) — xem `css-conventions.md`. Ngoại lệ: `AtsTemplate.css`, `CvPreview.css`.

## Trang login (`login/`)
```
login/
  index.html / main.tsx    # entry riêng, chỉ import src/theme.css
  LoginPage.tsx            # React + HeroUI
  authApi.ts               # gọi /api/request-otp, /api/verify-otp
vite.login.config.ts       # build login ra dist/login/ với base /login/
```
- Login là **bundle Vite thứ hai** (`npm run build` chạy 2 lần build). Mọi file của nó nằm dưới `/login/`, đường dẫn mà auth gate cho qua; bundle app ở `/assets/` vẫn bị chặn khi chưa đăng nhập.
- Code trong `login/` **không import gì từ `src/` ngoài `theme.css`** — import thêm sẽ kéo code app vào bundle công khai.
- Khi `npm run dev`, Vite phục vụ luôn `/login/` từ `login/index.html` (không có gate).

## Server-side (`netlify/`)
```
netlify/
  edge-functions/auth-gate.js   # chặn mọi request khi chưa có cookie phiên
  functions/
    _lib/session.js              # helper dùng chung (không phải function)
    request-otp.js / verify-otp.js / logout.js   # /api/*
```
- `netlify/` giữ **JavaScript** (port nguyên từ cv-by-html), không nằm trong `tsconfig` của app. Không chuyển sang TS trừ khi người dùng yêu cầu.
- Helper dùng chung giữa các function đặt trong `netlify/functions/_lib/` (thư mục bắt đầu bằng `_` và không có file trùng tên nên Netlify không deploy nó thành function).

## Bản thiết kế gốc (`asset/`)
- `asset/CV P1a.html`, `CV P1c.html`, `CV P1d.html` là bản export thiết kế — **nguồn tham chiếu, chỉ đọc**, nằm trong `.gitignore` (chứa dữ liệu cá nhân thật). Không import vào app, không serve ra ngoài. Khi người dùng gửi bản thiết kế mới thì chép đè vào đây.
- Cách đọc/giải nén xem `cv-templates.md`. File giải nén để tham chiếu đặt ở scratchpad, không commit.

## Asset tĩnh (ảnh, font)
- Đặt trong `public/images/` và `public/fonts/`, tham chiếu bằng đường dẫn tuyệt đối từ root: `/images/...`, `/fonts/...`.
- Ảnh đại diện người dùng upload **không** lưu thành file — lưu dạng data URL trong `CvData` để đi kèm file JSON export.
- Không đặt asset dùng trong app vào `src/assets/` trừ khi asset đó cần qua Vite build pipeline (import trực tiếp trong TS/CSS để hash tên file).

## File naming
- Component: PascalCase, trùng tên component (`CvForm.tsx`). Viết tắt 2 chữ cái trở lên vẫn chỉ hoa chữ đầu (`Cv`, không phải `CV`).
- Util/hook/type: camelCase (`buildCvView.ts`, `useCvData.ts`, `cv.ts`).
- CSS file: trùng tên với component/module mà nó style.
