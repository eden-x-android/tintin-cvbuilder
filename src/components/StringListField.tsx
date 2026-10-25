import { Label } from '@heroui/react';
import { moveItem, removeAt, replaceAt } from '../utils/listOps';
import AddButton from './AddButton';
import StringListRow from './StringListRow';

type StringListFieldProps = {
    label: string;
    items: string[];
    onChange: (items: string[]) => void;
    addLabel?: string;
    placeholder?: string;
    isMultiline?: boolean;
    allowsLinks?: boolean;
};

// Danh sách gạch đầu dòng: mỗi dòng một ô nhập, thêm/xoá/đổi thứ tự được.
const StringListField = ({
    label,
    items,
    onChange,
    addLabel = 'Add line',
    placeholder,
    isMultiline = true,
    allowsLinks = true,
}: StringListFieldProps) => {
    const handleChangeItem = (index: number, value: string) => onChange(replaceAt(items, index, value));
    const handleRemoveItem = (index: number) => onChange(removeAt(items, index));
    const handleMoveItem = (from: number, to: number) => onChange(moveItem(items, from, to));
    const handleAddItem = () => onChange([...items, '']);

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <Label>{label}</Label>
            {items.map((item, i) => (
                <StringListRow
                    key={i}
                    value={item}
                    index={i}
                    total={items.length}
                    ariaLabel={`${label} ${i + 1}`}
                    placeholder={placeholder}
                    isMultiline={isMultiline}
                    allowsLinks={allowsLinks}
                    onChange={value => handleChangeItem(i, value)}
                    onMove={handleMoveItem}
                    onRemove={handleRemoveItem}
                />
            ))}
            <AddButton label={addLabel} onPress={handleAddItem} />
        </div>
    );
};

export default StringListField;
