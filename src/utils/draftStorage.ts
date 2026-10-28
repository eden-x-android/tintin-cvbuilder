import type { CvData } from '../types/cv';
import { DEFAULT_TEMPLATE_ID, isTemplateId, type TemplateId } from '../templates/presets';
import { toDraftJson } from './cvIds';
import { validateCv } from './validateCv';

// Bản nháp tự lưu trong localStorage của trình duyệt — chỉ là tiện ích, không thay cho Export JSON.

const STORAGE_KEY = 'tintin-cv-draft';

export const loadDraft = (): { data: CvData; templateId: TemplateId } | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) return null;
        const { data, settings } = parsed as { data?: unknown; settings?: { templateId?: unknown } };
        const result = validateCv(data);
        if (!result.ok) return null;
        const templateId = settings?.templateId;
        return { data: result.data, templateId: isTemplateId(templateId) ? templateId : DEFAULT_TEMPLATE_ID };
    } catch {
        return null;
    }
};

export const saveDraft = (data: CvData, templateId: TemplateId): boolean => {
    try {
        localStorage.setItem(STORAGE_KEY, `{"data":${toDraftJson(data)},"settings":${JSON.stringify({ templateId })}}`);
        return true;
    } catch {
        return false;
    }
};
