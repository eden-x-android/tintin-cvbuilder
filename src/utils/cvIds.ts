import type { CvData } from '../types/cv';

export const createId = (): string => crypto.randomUUID();

// Field chỉ phục vụ bố cục in, không thuộc nội dung CV — file Export JSON bỏ đi (người dùng đã chốt).
const LAYOUT_KEYS = new Set(['sectionBreaks', 'pageBreakAfter']);

const stringify = (data: CvData, omitKeys: ReadonlySet<string>): string =>
    JSON.stringify(data, (key, value: unknown) => (omitKeys.has(key) ? undefined : value), 2);

// File Export JSON: chỉ nội dung CV — bỏ id nội bộ và các tuỳ chọn ngắt trang.
// Import lại thì ngắt trang về mặc định (tắt). Schema không có field nào tên `id`.
export const toExportJson = (data: CvData): string => stringify(data, new Set(['id', ...LAYOUT_KEYS]));

// Bản nháp trong trình duyệt giữ cả ngắt trang, để tải lại trang không mất cài đặt in.
export const toDraftJson = (data: CvData): string => stringify(data, new Set(['id']));
