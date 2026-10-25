import {
    PRESENT,
    SECTION_KEYS,
    type Certification,
    type CvData,
    type Education,
    type Job,
    type MetaEntry,
    type ObjectiveEntry,
    type Project,
    type Reference,
    type SectionBreaks,
    type SkillGroup,
} from '../types/cv';
import { createId } from './cvIds';
import { MONTH_PATTERN, YEAR_PATTERN } from './dates';

export type ValidationResult =
    | { ok: true; data: CvData; warnings: string[] }
    | { ok: false; errors: string[] };

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

// Đọc JSON không tin cậy thành CvData. Thiếu field → giá trị rỗng (null / '' / [] / false),
// sai kiểu → lỗi kèm đường dẫn để người dùng sửa file.
const createReader = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const nullableString = (value: unknown, path: string): string | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
        errors.push(`${path}: expected a string or null`);
        return null;
    };

    const string = (value: unknown, path: string): string => nullableString(value, path) ?? '';

    const boolean = (value: unknown, path: string): boolean => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'boolean') return value;
        errors.push(`${path}: expected true/false`);
        return false;
    };

    const pattern = (value: unknown, path: string, regex: RegExp, hint: string, allowPresent = false): string | null => {
        const text = nullableString(value, path);
        if (text === null || text === '') return null;
        if (regex.test(text) || (allowPresent && text === PRESENT)) return text;
        errors.push(`${path}: "${text}" has the wrong format, expected ${hint}`);
        return null;
    };

    const stringList = (value: unknown, path: string): string[] => {
        if (value === null || value === undefined) return [];
        if (!Array.isArray(value)) {
            errors.push(`${path}: expected an array of strings`);
            return [];
        }
        return value.map((item, i) => string(item, `${path}[${i}]`));
    };

    const record = (value: unknown, path: string): UnknownRecord => {
        if (value === null || value === undefined) return {};
        if (isRecord(value)) return value;
        errors.push(`${path}: expected an object`);
        return {};
    };

    const list = <T>(value: unknown, path: string, readItem: (item: UnknownRecord, itemPath: string) => T): T[] => {
        if (value === null || value === undefined) return [];
        if (!Array.isArray(value)) {
            errors.push(`${path}: expected an array`);
            return [];
        }
        return value.map((item, i) => readItem(record(item, `${path}[${i}]`), `${path}[${i}]`));
    };

    return { errors, warnings, nullableString, string, boolean, pattern, stringList, record, list };
};

export const validateCv = (input: unknown): ValidationResult => {
    if (!isRecord(input)) return { ok: false, errors: ['The JSON file must contain an object at the top level.'] };

    const r = createReader();
    const personal = r.record(input.personal, 'personal');
    const linkedin = r.record(personal.linkedin, 'personal.linkedin');
    const objective = r.record(input.objective, 'objective');
    const summary = r.record(input.summary, 'summary');
    const sectionBreaks = r.record(input.sectionBreaks, 'sectionBreaks');

    const readObjective = (key: keyof CvData['objective']): ObjectiveEntry => {
        const entry = r.record(objective[key], `objective.${key}`);
        return {
            label: r.string(entry.label, `objective.${key}.label`),
            text: r.nullableString(entry.text, `objective.${key}.text`),
            items: r.stringList(entry.items, `objective.${key}.items`),
        };
    };

    const readMeta = (m: UnknownRecord, path: string): MetaEntry => ({
        id: createId(),
        key: r.string(m.key, `${path}.key`),
        value: r.string(m.value, `${path}.value`),
    });

    const data: CvData = {
        personal: {
            fullName: r.string(personal.fullName, 'personal.fullName'),
            title: r.string(personal.title, 'personal.title'),
            dateOfBirth: r.nullableString(personal.dateOfBirth, 'personal.dateOfBirth'),
            email: r.nullableString(personal.email, 'personal.email'),
            phone: r.nullableString(personal.phone, 'personal.phone'),
            location: r.nullableString(personal.location, 'personal.location'),
            linkedin: {
                label: r.nullableString(linkedin.label, 'personal.linkedin.label'),
                url: r.nullableString(linkedin.url, 'personal.linkedin.url'),
            },
            photo: r.nullableString(personal.photo, 'personal.photo'),
        },
        objective: {
            shortTerm: readObjective('shortTerm'),
            longTerm: readObjective('longTerm'),
        },
        summary: {
            heading: r.string(summary.heading, 'summary.heading'),
            items: r.stringList(summary.items, 'summary.items'),
        },
        skills: r.list(input.skills, 'skills', (s, path): SkillGroup => ({
            id: createId(),
            category: r.string(s.category, `${path}.category`),
            items: r.stringList(s.items, `${path}.items`),
        })),
        experience: r.list(input.experience, 'experience', (j, path): Job => ({
            id: createId(),
            company: r.string(j.company, `${path}.company`),
            role: r.string(j.role, `${path}.role`),
            startDate: r.pattern(j.startDate, `${path}.startDate`, MONTH_PATTERN, '"YYYY-MM"'),
            endDate: r.pattern(j.endDate, `${path}.endDate`, MONTH_PATTERN, '"YYYY-MM" or "present"', true),
            responsibilities: r.stringList(j.responsibilities, `${path}.responsibilities`),
            pageBreakAfter: r.boolean(j.pageBreakAfter, `${path}.pageBreakAfter`),
        })),
        projects: r.list(input.projects, 'projects', (pj, path): Project => ({
            id: createId(),
            name: r.string(pj.name, `${path}.name`),
            meta: r.list(pj.meta, `${path}.meta`, readMeta),
            overview: r.nullableString(pj.overview, `${path}.overview`),
            responsibilities: r.stringList(pj.responsibilities, `${path}.responsibilities`),
            achievement: r.nullableString(pj.achievement, `${path}.achievement`),
            pageBreakAfter: r.boolean(pj.pageBreakAfter, `${path}.pageBreakAfter`),
        })),
        education: r.list(input.education, 'education', (e, path): Education => ({
            id: createId(),
            startYear: r.pattern(e.startYear, `${path}.startYear`, YEAR_PATTERN, '"YYYY"'),
            endYear: r.pattern(e.endYear, `${path}.endYear`, YEAR_PATTERN, '"YYYY"'),
            school: r.string(e.school, `${path}.school`),
            major: r.nullableString(e.major, `${path}.major`),
            gpa: r.nullableString(e.gpa, `${path}.gpa`),
        })),
        certifications: r.list(input.certifications, 'certifications', (c, path): Certification => ({
            id: createId(),
            year: r.nullableString(c.year, `${path}.year`),
            name: r.string(c.name, `${path}.name`),
            issuer: r.nullableString(c.issuer, `${path}.issuer`),
        })),
        references: r.list(input.references, 'references', (ref, path): Reference => ({
            id: createId(),
            name: r.string(ref.name, `${path}.name`),
            position: r.nullableString(ref.position, `${path}.position`),
            email: r.nullableString(ref.email, `${path}.email`),
        })),
        sectionBreaks: Object.fromEntries(
            SECTION_KEYS.map(key => [key, r.boolean(sectionBreaks[key], `sectionBreaks.${key}`)])
        ) as SectionBreaks,
    };

    if (r.errors.length > 0) return { ok: false, errors: r.errors };
    if (!data.personal.fullName) r.warnings.push('personal.fullName is empty');
    return { ok: true, data, warnings: r.warnings };
};
