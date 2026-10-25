import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { parseMonthValue, toMonthValue } from '../utils/dates';

export type PeriodMode = 'month' | 'year';

type PeriodGridProps = {
    mode: PeriodMode;
    value: string | null;
    onSelect: (value: string) => void;
    onClear: () => void;
};

const YEARS_PER_PAGE = 12;
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

// Lưới chọn tháng (12 tháng của 1 năm) hoặc năm (12 năm mỗi trang). Dùng trong popover lẫn bottom sheet.
const PeriodGrid = ({ mode, value, onSelect, onClear }: PeriodGridProps) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = toMonthValue(currentYear, now.getMonth() + 1);
    const selectedYear = mode === 'month' ? parseMonthValue(value ?? '')?.year : Number(value) || undefined;

    // Năm đang xem (chế độ tháng) hoặc năm đầu trang (chế độ năm).
    const [cursor, setCursor] = useState(() => {
        const base = selectedYear ?? currentYear;
        return mode === 'month' ? base : base - (base % YEARS_PER_PAGE);
    });

    const step = mode === 'month' ? 1 : YEARS_PER_PAGE;
    const cells =
        mode === 'month'
            ? Array.from({ length: 12 }, (_, i) => ({ value: toMonthValue(cursor, i + 1), label: MONTH_SHORT[i] }))
            : Array.from({ length: YEARS_PER_PAGE }, (_, i) => ({ value: String(cursor + i), label: String(cursor + i) }));
    const today = mode === 'month' ? currentMonth : String(currentYear);
    const heading = mode === 'month' ? String(cursor) : `${cursor} – ${cursor + YEARS_PER_PAGE - 1}`;

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
                <Button isIconOnly size="sm" variant="ghost" aria-label="Previous" onPress={() => setCursor(c => c - step)}>
                    <ChevronLeft />
                </Button>
                <span className="font-display text-base font-extrabold tabular-nums">{heading}</span>
                <Button isIconOnly size="sm" variant="ghost" aria-label="Next" onPress={() => setCursor(c => c + step)}>
                    <ChevronRight />
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
                {cells.map(cell => {
                    const isSelected = cell.value === value;
                    return (
                        <Button
                            key={cell.value}
                            size="md"
                            fullWidth
                            variant={isSelected ? 'primary' : cell.value === today ? 'outline' : 'ghost'}
                            aria-pressed={isSelected}
                            onPress={() => onSelect(cell.value)}
                        >
                            {cell.label}
                        </Button>
                    );
                })}
            </div>
            <div className="flex justify-between gap-2 border-t border-separator pt-2">
                <Button size="sm" variant="ghost" onPress={onClear}>Clear</Button>
                <Button size="sm" variant="secondary" onPress={() => onSelect(today)}>
                    {mode === 'month' ? 'This month' : 'This year'}
                </Button>
            </div>
        </div>
    );
};

export default PeriodGrid;
