import type { CvData } from '../types/cv';

export const createId = (): string => crypto.randomUUID();

// File export phải đúng schema gốc, nên bỏ mọi id nội bộ. Schema không có field nào tên `id`.
export const toExportJson = (data: CvData): string =>
    JSON.stringify(data, (key, value: unknown) => (key === 'id' ? undefined : value), 2);
