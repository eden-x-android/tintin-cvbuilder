import { ArrowDown, ArrowUp, TrashBin } from '@gravity-ui/icons';
import { Button } from '@heroui/react';

type IconActionsProps = {
    index: number;
    total: number;
    onMove: (from: number, to: number) => void;
    onRemove: (index: number) => void;
    itemLabel: string;
};

// Bộ nút lên / xuống / xoá dùng chung cho mọi list trong form.
const IconActions = ({ index, total, onMove, onRemove, itemLabel }: IconActionsProps) => (
    <div className="flex shrink-0 items-center gap-0.5">
        <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={`Move ${itemLabel} up`}
            isDisabled={index === 0}
            onPress={() => onMove(index, index - 1)}
        >
            <ArrowUp />
        </Button>
        <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={`Move ${itemLabel} down`}
            isDisabled={index === total - 1}
            onPress={() => onMove(index, index + 1)}
        >
            <ArrowDown />
        </Button>
        <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="text-danger"
            aria-label={`Delete ${itemLabel}`}
            onPress={() => onRemove(index)}
        >
            <TrashBin />
        </Button>
    </div>
);

export default IconActions;
