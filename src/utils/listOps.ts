// Thao tác mảng bất biến dùng chung cho form (không mutate mảng/phần tử gốc).

export const replaceAt = <T>(items: readonly T[], index: number, next: T): T[] =>
    items.map((item, i) => (i === index ? next : item));

export const removeAt = <T>(items: readonly T[], index: number): T[] =>
    items.filter((_, i) => i !== index);

export const moveItem = <T>(items: readonly T[], from: number, to: number): T[] => {
    if (to < 0 || to >= items.length) return [...items];
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
};

// Ô nhập trống của field nullable lưu thành null, để JSON export giữ đúng schema.
export const toNullable = (value: string): string | null => (value === '' ? null : value);
