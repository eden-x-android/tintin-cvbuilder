// Giá trị copy nguyên từ THEMES / FONTS trong bản export (asset/*.html).
// Chỉ 3 preset P1a / P1c / P1d — xem .agents/rules/cv-templates.md.

export type CvTheme = {
    name: string;
    accent: string;
    soft: string;
    line: string;
    border: string;
    tint: string;
    dot: string;
    ink: string;
};

export type CvFont = {
    name: string;
    head: string;
    body: string;
};

export type TemplateId = 'P1a' | 'P1c' | 'P1d';

export type TemplatePreset = {
    id: TemplateId;
    label: string;
    theme: CvTheme;
    font: CvFont;
};

const THEMES = {
    cobalt: { name: 'Cobalt', accent: '#2346b0', soft: '#f1f4fb', line: '#e0e6f3', border: '#cdd7ec', tint: '#e8edf8', dot: '#a9b8de', ink: '#1b1f2a' },
    ink: { name: 'Ink (đen trắng)', accent: '#1d1d1f', soft: '#f3f3f1', line: '#e4e4e1', border: '#d2d2ce', tint: '#ececea', dot: '#b5b5b1', ink: '#1d1d1f' },
    forest: { name: 'Forest', accent: '#22513f', soft: '#f0f5f2', line: '#dfe9e3', border: '#cbdcd2', tint: '#e6efea', dot: '#a3bfb1', ink: '#1c2420' },
} as const satisfies Record<string, CvTheme>;

const FONTS = {
    manrope: { name: 'Manrope', head: "'Manrope', sans-serif", body: "'Manrope', sans-serif" },
    swiss: { name: 'Archivo', head: "'Archivo', sans-serif", body: "'Archivo', sans-serif" },
    editorial: { name: 'Cormorant Garamond + Mulish', head: "'Cormorant Garamond', serif", body: "'Mulish', sans-serif" },
} as const satisfies Record<string, CvFont>;

export const TEMPLATE_PRESETS: readonly TemplatePreset[] = [
    { id: 'P1a', label: 'Clean · Cobalt · Manrope', theme: THEMES.cobalt, font: FONTS.manrope },
    { id: 'P1c', label: 'Clean · Ink · Archivo', theme: THEMES.ink, font: FONTS.swiss },
    { id: 'P1d', label: 'Clean · Forest · Cormorant', theme: THEMES.forest, font: FONTS.editorial },
];

export const DEFAULT_TEMPLATE_ID: TemplateId = 'P1a';

export const getPreset = (id: TemplateId): TemplatePreset =>
    TEMPLATE_PRESETS.find(preset => preset.id === id) ?? TEMPLATE_PRESETS[0];

export const isTemplateId = (value: unknown): value is TemplateId =>
    TEMPLATE_PRESETS.some(preset => preset.id === value);
