import { ComboBox, Input, Label, ListBox, TextField } from '@heroui/react';
import type { MetaEntry } from '../types/cv';
import { createMetaEntry } from '../data/emptyItems';
import { moveItem, removeAt, replaceAt } from '../utils/listOps';
import AddButton from './AddButton';
import IconActions from './IconActions';

type MetaEditorProps = {
    items: MetaEntry[];
    onChange: (items: MetaEntry[]) => void;
};

// Gợi ý key hay dùng; người dùng vẫn gõ key tuỳ ý.
const KEY_SUGGESTIONS = ['Platform', 'OS', 'SDLC', 'Type', 'Tech stack', 'Team size', 'Role', 'Duration'];

// Metadata dự án dạng key-value; CV in nối lại thành "Key: Value · Key: Value".
const MetaEditor = ({ items, onChange }: MetaEditorProps) => {
    const handleEntryChange = (index: number, patch: Partial<MetaEntry>) =>
        onChange(replaceAt(items, index, { ...items[index], ...patch }));

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <Label>Project details (metadata)</Label>
            {items.map((entry, i) => (
                <div key={entry.id} className="flex items-start gap-1.5">
                    <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-1.5">
                        <ComboBox
                            allowsCustomValue
                            fullWidth
                            aria-label={`Key ${i + 1}`}
                            inputValue={entry.key}
                            onInputChange={key => handleEntryChange(i, { key })}
                            menuTrigger="focus"
                        >
                            <ComboBox.InputGroup>
                                <Input placeholder="Key (e.g. SDLC)" />
                                <ComboBox.Trigger />
                            </ComboBox.InputGroup>
                            <ComboBox.Popover>
                                <ListBox>
                                    {KEY_SUGGESTIONS.map(key => (
                                        <ListBox.Item key={key} id={key} textValue={key}>
                                            {key}
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </ComboBox.Popover>
                        </ComboBox>
                        <TextField
                            fullWidth
                            aria-label={`Value ${i + 1}`}
                            value={entry.value}
                            onChange={value => handleEntryChange(i, { value })}
                        >
                            <Input placeholder="Value (e.g. Agile/Scrum)" />
                        </TextField>
                    </div>
                    <div className="pt-1">
                        <IconActions
                            index={i}
                            total={items.length}
                            onMove={(from, to) => onChange(moveItem(items, from, to))}
                            onRemove={index => onChange(removeAt(items, index))}
                            itemLabel="metadata row"
                        />
                    </div>
                </div>
            ))}
            <AddButton label="Add row" onPress={() => onChange([...items, createMetaEntry()])} />
        </div>
    );
};

export default MetaEditor;
