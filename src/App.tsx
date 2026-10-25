import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRightFromSquare, FileArrowDown, FileArrowUp, Printer } from '@gravity-ui/icons';
import { Alert, Button, CloseButton, ListBox, Select } from '@heroui/react';
import type { CvData } from './types/cv';
import { DEFAULT_TEMPLATE_ID, TEMPLATE_PRESETS, getPreset, isTemplateId, type TemplateId } from './templates/presets';
import { createSampleCv } from './data/sampleCv';
import { buildCvView } from './utils/buildCvView';
import { toExportJson } from './utils/cvIds';
import { loadDraft, saveDraft } from './utils/draftStorage';
import { validateCv } from './utils/validateCv';
import CvForm from './components/CvForm';
import CvPreview from './components/CvPreview';

type Notice = { status: 'danger' | 'warning' | 'success'; title: string; lines: string[] };

// Số lỗi tối đa liệt kê trong thông báo import, tránh banner dài cả trang.
const MAX_NOTICE_LINES = 8;

const toFileSlug = (name: string): string =>
    name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/gi, 'd')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'cv';

const App = () => {
    const [initialDraft] = useState(loadDraft);
    const [cvData, setCvData] = useState<CvData>(() => initialDraft?.data ?? createSampleCv());
    const [templateId, setTemplateId] = useState<TemplateId>(() => initialDraft?.templateId ?? DEFAULT_TEMPLATE_ID);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isDraftSaved, setIsDraftSaved] = useState(true);
    const importInputRef = useRef<HTMLInputElement>(null);

    const preset = getPreset(templateId);
    const view = useMemo(() => buildCvView(cvData), [cvData]);

    // Tự lưu nháp sau mỗi lần sửa (debounce nhẹ để không ghi localStorage mỗi phím gõ).
    useEffect(() => {
        const timer = setTimeout(() => setIsDraftSaved(saveDraft(cvData, templateId)), 400);
        return () => clearTimeout(timer);
    }, [cvData, templateId]);

    const handleImportFile = async (file: File | undefined) => {
        if (!file) return;
        try {
            const result = validateCv(JSON.parse(await file.text()));
            if (!result.ok) {
                setNotice({ status: 'danger', title: `Couldn't import ${file.name}: invalid schema`, lines: result.errors });
                return;
            }
            setCvData(result.data);
            setNotice(
                result.warnings.length > 0
                    ? { status: 'warning', title: `Imported ${file.name} with warnings`, lines: result.warnings }
                    : { status: 'success', title: `Imported ${file.name}`, lines: [] }
            );
        } catch {
            setNotice({ status: 'danger', title: `Couldn't read ${file.name}`, lines: ['The file is not valid JSON.'] });
        } finally {
            if (importInputRef.current) importInputRef.current.value = '';
        }
    };

    const handleExport = () => {
        const blob = new Blob([toExportJson(cvData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cv-${toFileSlug(cvData.personal.fullName)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            {/* Header dính trên cùng khi cuộn: logo, chọn mẫu CV, các thao tác chính. */}
            <header className="sticky top-0 z-30 border-b border-separator bg-background/85 backdrop-blur-md print:hidden">
                <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-accent font-display text-sm font-black text-accent-foreground">
                            CV
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-display text-lg leading-tight font-black tracking-tight">Tintin CV Builder</h1>
                            <p className="text-xs text-muted">{isDraftSaved ? 'Draft saved in this browser' : "Couldn't save draft"}</p>
                        </div>
                    </div>

                    <Select
                        aria-label="CV template"
                        className="order-last w-full md:order-none md:ms-4 md:w-60 xl:w-72"
                        value={templateId}
                        onChange={value => {
                            if (isTemplateId(value)) setTemplateId(value);
                        }}
                    >
                        <Select.Trigger>
                            <Select.Value>
                                <span className="flex min-w-0 items-center gap-2">
                                    <span className="size-3 shrink-0 rounded-full" style={{ background: preset.theme.accent }} />
                                    <span className="font-semibold">{preset.id}</span>
                                    <span className="truncate text-muted">{preset.label}</span>
                                </span>
                            </Select.Value>
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {TEMPLATE_PRESETS.map(p => (
                                    <ListBox.Item key={p.id} id={p.id} textValue={`${p.id} ${p.label}`}>
                                        <span className="size-3 shrink-0 rounded-full" style={{ background: p.theme.accent }} />
                                        <span className="font-semibold">{p.id}</span>
                                        <span className="text-muted">{p.label}</span>
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>

                    <div className="ms-auto flex items-center gap-2">
                        <Button variant="secondary" aria-label="Import JSON" onPress={() => importInputRef.current?.click()}>
                            <FileArrowUp />
                            <span className="hidden xl:inline">Import JSON</span>
                        </Button>
                        <Button variant="secondary" aria-label="Export JSON" onPress={handleExport}>
                            <FileArrowDown />
                            <span className="hidden xl:inline">Export JSON</span>
                        </Button>
                        <Button onPress={() => window.print()}>
                            <Printer />
                            In / PDF
                        </Button>
                        <Button isIconOnly variant="ghost" aria-label="Sign out" onPress={() => window.location.assign('/api/logout')}>
                            <ArrowRightFromSquare />
                        </Button>
                        <input
                            ref={importInputRef}
                            type="file"
                            accept="application/json,.json"
                            hidden
                            onChange={e => handleImportFile(e.target.files?.[0])}
                        />
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-[1680px] px-4 pt-4 pb-16 sm:px-6 print:max-w-none print:p-0">
                {notice && (
                    <Alert status={notice.status} className="mb-4 print:hidden">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>{notice.title}</Alert.Title>
                            {notice.lines.length > 0 && (
                                <Alert.Description>
                                    <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">
                                        {notice.lines.slice(0, MAX_NOTICE_LINES).map((line, i) => <li key={i}>{line}</li>)}
                                        {notice.lines.length > MAX_NOTICE_LINES && (
                                            <li>…and {notice.lines.length - MAX_NOTICE_LINES} more</li>
                                        )}
                                    </ul>
                                </Alert.Description>
                            )}
                        </Alert.Content>
                        <CloseButton aria-label="Dismiss" onPress={() => setNotice(null)} />
                    </Alert>
                )}

                <main className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(400px,560px)_minmax(0,1fr)] print:block">
                    <div className="min-w-0 print:hidden">
                        <CvForm data={cvData} onChange={setCvData} />
                    </div>
                    {/* top-20 = chiều cao header dính + khoảng cách, để preview không chui dưới header. */}
                    <div className="min-w-0 rounded-2xl bg-default/60 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto print:static print:max-h-none print:overflow-visible print:rounded-none print:bg-transparent">
                        <CvPreview view={view} preset={preset} />
                    </div>
                </main>
            </div>
        </>
    );
};

export default App;
