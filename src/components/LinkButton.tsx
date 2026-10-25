import { useRef, useState, type RefObject } from 'react';
import { Link as LinkIcon } from '@gravity-ui/icons';
import { Button, Input, Label, Popover, TextField } from '@heroui/react';
import { normalizeHref } from '../utils/richText';

type LinkButtonProps = {
    // Ô text đang được gắn link — đọc vùng bôi đen để biến nó thành chữ của link.
    targetRef: RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
    value: string;
    onChange: (value: string) => void;
};

// Nút 🔗: bôi đen chữ, bấm nút, dán URL → chèn [chữ](url) vào text.
const LinkButton = ({ targetRef, value, onChange }: LinkButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState('');
    const selectionRef = useRef({ start: value.length, end: value.length });

    const handleOpenChange = (open: boolean) => {
        if (open) {
            // Ô text giữ nguyên vùng chọn khi mất focus sang nút, nên đọc ở thời điểm mở.
            const target = targetRef.current;
            selectionRef.current = {
                start: target?.selectionStart ?? value.length,
                end: target?.selectionEnd ?? value.length,
            };
            setUrl('');
        }
        setIsOpen(open);
    };

    const handleInsert = () => {
        if (!url.trim()) return;
        const href = normalizeHref(url);
        const { start, end } = selectionRef.current;
        const label = value.slice(start, end).trim() || href.replace(/^https?:\/\//i, '').replace(/\/$/, '');
        const markdown = `[${label}](${href})`;
        onChange(value.slice(0, start) + markdown + value.slice(end));
        setIsOpen(false);

        const caret = start + markdown.length;
        // Đợi text mới render rồi mới đặt lại con trỏ.
        requestAnimationFrame(() => {
            const target = targetRef.current;
            target?.focus();
            target?.setSelectionRange(caret, caret);
        });
    };

    return (
        <Popover isOpen={isOpen} onOpenChange={handleOpenChange}>
            <Button isIconOnly size="sm" variant="ghost" aria-label="Insert link">
                <LinkIcon />
            </Button>
            <Popover.Content placement="bottom end" className="w-72">
                <Popover.Dialog aria-label="Insert link">
                    <form
                        className="flex flex-col gap-3"
                        onSubmit={e => {
                            e.preventDefault();
                            handleInsert();
                        }}
                    >
                        <TextField autoFocus value={url} onChange={setUrl} fullWidth>
                            <Label>URL</Label>
                            <Input placeholder="https://..." />
                        </TextField>
                        <p className="text-xs text-muted">
                            The selected text becomes the link text. With nothing selected, the URL itself is used.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onPress={() => setIsOpen(false)}>Cancel</Button>
                            <Button size="sm" type="submit" isDisabled={!url.trim()}>Insert</Button>
                        </div>
                    </form>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    );
};

export default LinkButton;
