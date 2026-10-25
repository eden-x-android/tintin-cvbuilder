import { PRESENT } from '../types/cv';

// CV viết tiếng Anh nên tên tháng in ra là tiếng Anh, giống thiết kế ("June 2024").
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
export const YEAR_PATTERN = /^\d{4}$/;

export const toMonthValue = (year: number, month: number): string => `${year}-${String(month).padStart(2, '0')}`;

export const parseMonthValue = (value: string): { year: number; month: number } | null => {
    if (!MONTH_PATTERN.test(value)) return null;
    const [year, month] = value.split('-').map(Number);
    return { year, month };
};

// "2024-06" → "June 2024", PRESENT → "Present".
export const formatMonth = (value: string): string => {
    if (value === PRESENT) return 'Present';
    const parsed = parseMonthValue(value);
    return parsed ? `${MONTH_NAMES[parsed.month - 1]} ${parsed.year}` : value;
};

// So sánh chuỗi "YYYY-MM" / "YYYY" được vì cùng độ dài và đệm số 0.
export const isBefore = (a: string, b: string): boolean => a < b;
