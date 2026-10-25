import { useId, useState } from 'react';
import { Calendar } from '@gravity-ui/icons';
import { Button, Drawer, Label, Popover } from '@heroui/react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { formatMonth } from '../utils/dates';
import PeriodGrid, { type PeriodMode } from './PeriodGrid';

type MonthYearPickerProps = {
    label: string;
    mode: PeriodMode;
    value: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    isDisabled?: boolean;
    errorMessage?: string | null;
};

// Bottom sheet thay cho popover khi màn hình hẹp: ô bấm to hơn, không bị tràn mép.
const NARROW_SCREEN = '(max-width: 640px)';

// Chọn tháng/năm (DatePicker của HeroUI chỉ chọn tới ngày, CV chỉ cần tháng hoặc năm).
const MonthYearPicker = ({
    label,
    mode,
    value,
    onChange,
    placeholder = mode === 'month' ? 'Select month' : 'Select year',
    isDisabled = false,
    errorMessage = null,
}: MonthYearPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const isNarrow = useMediaQuery(NARROW_SCREEN);
    const labelId = useId();

    const display = value ? (mode === 'month' ? formatMonth(value) : value) : null;

    const handleSelect = (next: string) => {
        onChange(next);
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange(null);
        setIsOpen(false);
    };

    const grid = <PeriodGrid mode={mode} value={value} onSelect={handleSelect} onClear={handleClear} />;

    const trigger = (
        <Button
            fullWidth
            variant="tertiary"
            isDisabled={isDisabled}
            aria-labelledby={labelId}
            aria-invalid={errorMessage ? true : undefined}
            className={`justify-between font-normal ${errorMessage ? 'ring-2 ring-danger' : ''}`}
            onPress={isNarrow ? () => setIsOpen(true) : undefined}
        >
            <span className={display ? 'text-foreground' : 'text-muted'}>{display ?? placeholder}</span>
            <Calendar className="text-muted" />
        </Button>
    );

    return (
        <div className="flex min-w-0 flex-col gap-1">
            <Label id={labelId}>{label}</Label>
            {isNarrow ? (
                <>
                    {trigger}
                    <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
                        <Drawer.Content placement="bottom">
                            <Drawer.Dialog aria-label={label}>
                                <Drawer.Handle />
                                <Drawer.Header>
                                    <Drawer.Heading>{label}</Drawer.Heading>
                                </Drawer.Header>
                                <Drawer.Body className="pb-6">{grid}</Drawer.Body>
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </>
            ) : (
                <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
                    {trigger}
                    <Popover.Content placement="bottom start" className="w-80">
                        <Popover.Dialog aria-label={label}>{grid}</Popover.Dialog>
                    </Popover.Content>
                </Popover>
            )}
            {errorMessage && <span className="text-xs font-medium text-danger">{errorMessage}</span>}
        </div>
    );
};

export default MonthYearPicker;
