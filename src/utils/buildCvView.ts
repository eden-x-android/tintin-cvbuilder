import type { CvData } from '../types/cv';
import { formatMonth } from './dates';
import { hasValue } from './hasValue';

// Port của renderVals() trong bản export (asset/*.html), chỉ phần layout ATS + footer 1,
// cộng các thay đổi đã chốt: projects tách riêng, meta key-value, ngắt trang chủ động.

export type ContactView = { label: string; value: string; href: string | null };

export type CvView = ReturnType<typeof buildCvView>;

const compact = (items: string[]): string[] => items.filter(hasValue);

// Ghép khoảng thời gian bằng en dash, bỏ vế rỗng.
const span = (a: string | null, b: string | null): string => [a, b].filter(hasValue).join(' – ');

// Mục nào có dữ liệu thì hiện, không có thì ẩn (không có công tắc ẩn/hiện riêng).
export const buildCvView = (data: CvData) => {
    const p = data.personal;
    const linkedinUrl = p.linkedin.url;

    const contacts: ContactView[] = [
        { label: 'Email', value: p.email, href: p.email ? `mailto:${p.email}` : null },
        { label: 'Phone', value: p.phone, href: p.phone ? `tel:${p.phone.replace(/\s/g, '')}` : null },
        { label: 'Birth', value: p.dateOfBirth, href: null },
        {
            label: p.linkedin.label || 'LinkedIn',
            value: linkedinUrl ? linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null,
            href: linkedinUrl || null,
        },
    ].filter((c): c is ContactView => hasValue(c.value));

    const objectives = [data.objective.shortTerm, data.objective.longTerm]
        .map(o => ({ label: o.label, text: hasValue(o.text) ? o.text : null, items: compact(o.items) }))
        .filter(o => hasValue(o.label) || o.text !== null || o.items.length > 0);

    const references = data.references.map(ref => ({
        id: ref.id,
        name: ref.name,
        position: hasValue(ref.position) ? ref.position : null,
        email: hasValue(ref.email) ? ref.email : null,
    }));

    return {
        fullName: p.fullName,
        title: p.title,
        location: p.location ?? '',
        photo: hasValue(p.photo) ? p.photo : null,
        contacts,
        summary: compact(data.summary.items),
        objectives,
        skills: data.skills
            .map(s => ({ id: s.id, category: s.category, items: compact(s.items) }))
            .filter(s => hasValue(s.category) || s.items.length > 0),
        experience: data.experience.map(job => ({
            id: job.id,
            company: job.company,
            role: job.role,
            period: span(job.startDate && formatMonth(job.startDate), job.endDate && formatMonth(job.endDate)),
            responsibilities: compact(job.responsibilities),
            pageBreakAfter: job.pageBreakAfter,
        })),
        projects: data.projects.map(pj => ({
            id: pj.id,
            name: pj.name,
            metaLine: pj.meta
                .filter(m => hasValue(m.key) || hasValue(m.value))
                .map(m => (hasValue(m.key) ? `${m.key}: ${m.value}` : m.value))
                .join('  ·  '),
            overview: hasValue(pj.overview) ? pj.overview : null,
            responsibilities: compact(pj.responsibilities),
            achievement: hasValue(pj.achievement) ? pj.achievement : null,
            pageBreakAfter: pj.pageBreakAfter,
        })),
        education: data.education.map(e => ({
            id: e.id,
            school: e.school,
            major: hasValue(e.major) ? e.major : null,
            period: span(e.startYear, e.endYear),
            gpa: hasValue(e.gpa) ? e.gpa : null,
        })),
        certifications: data.certifications.map(c => ({
            id: c.id,
            name: c.name,
            year: hasValue(c.year) ? c.year : null,
            issuer: hasValue(c.issuer) ? c.issuer : null,
        })),
        references,
        breaks: data.sectionBreaks,
    };
};
