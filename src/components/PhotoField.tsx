import { useRef, useState } from 'react';
import { Picture } from '@gravity-ui/icons';
import { Button, Label } from '@heroui/react';
import { resizePhoto } from '../utils/resizePhoto';

type PhotoFieldProps = {
    photo: string | null;
    onChange: (photo: string | null) => void;
};

const PhotoField = ({ photo, onChange }: PhotoFieldProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('The file is not an image.');
            return;
        }
        try {
            onChange(await resizePhoto(file));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't process the image.");
        } finally {
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex size-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-default text-muted">
                {photo ? <img className="size-full object-cover" src={photo} alt="Profile photo" /> : <Picture className="size-6" />}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
                <Label>Profile photo</Label>
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onPress={() => inputRef.current?.click()}>
                        {photo ? 'Change photo' : 'Upload photo'}
                    </Button>
                    {photo && (
                        <Button size="sm" variant="ghost" onPress={() => onChange(null)}>Remove</Button>
                    )}
                </div>
                <span className="text-xs text-muted">Cropped to a centered square and saved inside the JSON file.</span>
                {error && <span className="text-xs font-medium text-danger">{error}</span>}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={e => handleFileChange(e.target.files?.[0])}
            />
        </div>
    );
};

export default PhotoField;
