import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';

type AddButtonProps = {
    label: string;
    onPress: () => void;
};

// Nút "+ Thêm ..." ở cuối mọi list trong form.
const AddButton = ({ label, onPress }: AddButtonProps) => (
    <Button size="sm" variant="secondary" className="self-start" onPress={onPress}>
        <Plus />
        {label}
    </Button>
);

export default AddButton;
