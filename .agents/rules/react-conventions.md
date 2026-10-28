---
name: react-conventions
description: React/TSX component, TypeScript typing, state, và naming convention cho project tintin-cvbuilder-edenx
---

# React / TSX Conventions

## TypeScript
- `tsconfig` bật `strict`. Không dùng `any`; dữ liệu chưa biết kiểu (JSON import, `JSON.parse`) nhận là `unknown` rồi thu hẹp qua hàm validate.
- Schema CV khai báo **một lần duy nhất** trong `src/types/cv.ts` (`CvData` và các type con). Form, validate import, view-model và mẫu CV đều import từ đây — không khai báo lại shape ở nơi khác.
- Trường có thể `null` trong schema (`os`, `type`, `achievement`, `issuer`, ...) phải khai báo đúng `string | null`, không dùng `?:` để né. Render thì lọc rỗng qua helper chung (`hasValue`), không rải `x && x !== ''` khắp nơi.
- Props khai báo bằng `type XxxProps = { ... }` ngay trên component, không dùng `interface` cho props, không dùng `React.FC`.
- Dùng `import type` cho import chỉ chứa type.

## Component declaration
- Luôn khai báo component bằng **arrow-function const**, kể cả component gốc (`App`). Không dùng `function Component() {}`.
  ```tsx
  type CvFormProps = {
    data: CvData;
    onChange: (next: CvData) => void;
  };

  const CvForm = ({ data, onChange }: CvFormProps) => {
    // ...
  };
  ```
- Mỗi file chỉ chứa **1 component**. Tên file PascalCase trùng tên component (`CvForm.tsx` → `CvForm`).
- `export default ComponentName;` đặt ở **cuối file**, không dùng `export default function` hay named export cho component chính.

## State management
- Toàn bộ dữ liệu CV đặt ở `App` bằng `useState<CvData>`, truyền xuống con qua props (prop drilling). Chưa cần Context/Redux — chỉ cân nhắc Context khi prop drilling vượt quá 2-3 cấp.
- Update state lồng nhau qua callback + spread, không mutate trực tiếp. Schema có mảng lồng 2 tầng (`experience[].projects[].responsibilities[]`) nên phải copy đúng từng tầng:
  ```ts
  // Sai — mutate object gốc dù mảng ngoài đã copy
  const next = [...data.experience];
  next[i].projects[j].name = value;

  // Đúng
  const next = data.experience.map((job, ji) =>
      ji !== i ? job : {
          ...job,
          projects: job.projects.map((pj, pi) => (pi === j ? { ...pj, name: value } : pj)),
      }
  );
  ```
- View-model cho mẫu CV (lọc rỗng, ghép khoảng thời gian, đánh số project) tính bằng hàm thuần trong `src/utils/`, không tính trong JSX.

## Naming
- Hàm xử lý sự kiện/thao tác người dùng luôn có tiền tố `handleX` — kể cả thêm/xóa item (`handleAddItem`, `handleRemoveItem`, không dùng `addItem`/`removeItem` trần).
- Biến/props: camelCase. Boolean: tiền tố `is`/`has`/`show` (`isUploading`, `hasError`, `isCurrent`).
- Field boolean trong data model không được trùng lặp ý nghĩa (tránh kiểu `pageBreak` và `pageBreakAfter` cùng tồn tại) — chỉ giữ 1 field cho 1 khái niệm.
- Type/union: PascalCase (`CvData`, `TemplateId`). Hằng cấu hình (themes, fonts, presets): `UPPER_SNAKE_CASE` hoặc object `as const`.

## Key & id cho list
- File **Export JSON** bỏ `id` nội bộ và các field ngắt trang (`sectionBreaks`, `pageBreakAfter`) — xem `toExportJson`; nháp localStorage dùng `toDraftJson` để giữ ngắt trang. Import file thiếu các field này thì coi là tắt.
- Schema JSON **không có `id`**. List object có thể thêm/xóa/sắp xếp (experience, projects, `projects[].meta`, education, certifications, references, skills) được gán `id` nội bộ khi import/tạo mới, và bị loại bỏ khi export JSON — file export phải đúng schema.
- `key` dùng id ổn định đó, không dùng `key={index}`. Riêng list chuỗi đơn thuần (`string[]` như `responsibilities`, `skills[].items`) không reorder thì được dùng index.

## JSX patterns
- Mọi chữ hiển thị trên UI (label, nút, placeholder, thông báo, lỗi validate, `aria-label`, trang login) viết **tiếng Anh** — người dùng đã chốt vì UI tiếng Việt gây rối khi nội dung CV là tiếng Anh. Comment trong code vẫn viết tiếng Việt.
- Conditional render dùng `&&`, tránh ternary lồng sâu cho render block:
  ```tsx
  {hasValue(project.achievement) && (
      <p className="project-achievement">{project.achievement}</p>
  )}
  ```
- UI dùng component HeroUI v3 (API compound: `Select.Trigger`, `Card.Header`...; sự kiện là `onPress`/`onChange(value)`, không phải `onClick`/`e.target.value`). Styling bằng Tailwind `className`; inline style chỉ cho giá trị động (màu swatch theo preset, biến `--cv-*`) — xem `css-conventions.md`.
- Text dài cho phép link: dùng `RichTextArea` hoặc `StringListField` (có nút chèn link); hiển thị qua `renderRichText`, không bao giờ `dangerouslySetInnerHTML`.
- Không để lại `console.log`/`console.error` trong render path hoặc trong code merge vào nhánh chính. Nếu cần debug tạm, xóa trước khi commit.
- Không dùng `dangerouslySetInnerHTML` với dữ liệu từ JSON người dùng import. Render text thuần qua JSX.
