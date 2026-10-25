import { Input, Label, TextField } from '@heroui/react';

type TextInputProps = {
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'tel' | 'url';
    className?: string;
};

// Ô nhập một dòng. Field nullable: cha tự đổi '' → null bằng toNullable().
const TextInput = ({ label, value, onChange, placeholder, type = 'text', className }: TextInputProps) => (
    <TextField className={className} fullWidth type={type} value={value ?? ''} onChange={onChange}>
        <Label>{label}</Label>
        <Input placeholder={placeholder} />
    </TextField>
);

export default TextInput;
