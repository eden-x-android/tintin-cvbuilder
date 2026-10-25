import { useRef } from 'react';
import { Label, TextArea, TextField } from '@heroui/react';
import LinkButton from './LinkButton';

type RichTextAreaProps = {
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
};

// Ô văn bản dài có nút chèn link [chữ](url) — dùng cho overview, result, objective...
const RichTextArea = ({ label, value, onChange, placeholder, rows = 3 }: RichTextAreaProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const text = value ?? '';

    return (
        <TextField fullWidth value={text} onChange={onChange}>
            <div className="flex items-center justify-between gap-2">
                <Label>{label}</Label>
                <LinkButton targetRef={textAreaRef} value={text} onChange={onChange} />
            </div>
            <TextArea ref={textAreaRef} rows={rows} placeholder={placeholder} />
        </TextField>
    );
};

export default RichTextArea;
