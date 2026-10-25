import { useRef } from 'react';
import { Input, TextArea, TextField } from '@heroui/react';
import IconActions from './IconActions';
import LinkButton from './LinkButton';

type StringListRowProps = {
    value: string;
    index: number;
    total: number;
    ariaLabel: string;
    placeholder?: string;
    isMultiline: boolean;
    allowsLinks: boolean;
    onChange: (value: string) => void;
    onMove: (from: number, to: number) => void;
    onRemove: (index: number) => void;
};

// Một dòng trong StringListField: ô nhập + (nút link) + lên/xuống/xoá.
const StringListRow = ({
    value,
    index,
    total,
    ariaLabel,
    placeholder,
    isMultiline,
    allowsLinks,
    onChange,
    onMove,
    onRemove,
}: StringListRowProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        // Màn hình hẹp: nút thao tác xuống dưới ô nhập để ô nhập đủ rộng.
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-1.5">
            <TextField className="min-w-0 flex-1" fullWidth aria-label={ariaLabel} value={value} onChange={onChange}>
                {isMultiline ? (
                    <TextArea ref={textAreaRef} rows={2} placeholder={placeholder} />
                ) : (
                    <Input ref={inputRef} placeholder={placeholder} />
                )}
            </TextField>
            <div className="flex shrink-0 items-center justify-end sm:pt-1">
                {allowsLinks && (
                    <LinkButton targetRef={isMultiline ? textAreaRef : inputRef} value={value} onChange={onChange} />
                )}
                <IconActions index={index} total={total} onMove={onMove} onRemove={onRemove} itemLabel="line" />
            </div>
        </div>
    );
};

export default StringListRow;
