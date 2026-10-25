// Schema CV — nguồn duy nhất của shape dữ liệu (xem .agents/rules/react-conventions.md).
// `id` trên các item list là id nội bộ: gán khi import/tạo mới, bỏ khi export (utils/cvIds.ts).
// Text dài có thể chứa link dạng [chữ](url) — xem utils/richText.tsx.

// Tháng dạng "YYYY-MM", năm dạng "YYYY". CV in ra "June 2024" (utils/dates.ts).
export type MonthValue = string;
export type YearValue = string;
export const PRESENT = 'present';

export type LinkedIn = {
    label: string | null;
    url: string | null;
};

export type Personal = {
    fullName: string;
    title: string;
    dateOfBirth: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    linkedin: LinkedIn;
    // Data URL của ảnh đại diện, để ảnh đi kèm file JSON export.
    photo: string | null;
};

export type ObjectiveEntry = {
    label: string;
    text: string | null;
    items: string[];
};

export type Objective = {
    shortTerm: ObjectiveEntry;
    longTerm: ObjectiveEntry;
};

export type Summary = {
    heading: string;
    items: string[];
};

export type SkillGroup = {
    id: string;
    category: string;
    items: string[];
};

export type Job = {
    id: string;
    company: string;
    role: string;
    startDate: MonthValue | null;
    // "YYYY-MM" hoặc PRESENT khi đang làm.
    endDate: MonthValue | typeof PRESENT | null;
    responsibilities: string[];
    pageBreakAfter: boolean;
};

// Một dòng metadata của dự án, ví dụ { key: 'SDLC', value: 'Agile/Scrum' }.
export type MetaEntry = {
    id: string;
    key: string;
    value: string;
};

export type Project = {
    id: string;
    name: string;
    meta: MetaEntry[];
    overview: string | null;
    responsibilities: string[];
    achievement: string | null;
    pageBreakAfter: boolean;
};

export type Education = {
    id: string;
    startYear: YearValue | null;
    endYear: YearValue | null;
    school: string;
    major: string | null;
    gpa: string | null;
};

export type Certification = {
    id: string;
    year: string | null;
    name: string;
    issuer: string | null;
};

export type Reference = {
    id: string;
    name: string;
    position: string | null;
    email: string | null;
};

// Các cụm có thể "bắt đầu ở trang mới" khi in. `footer` = Education + Certifications + References.
export const SECTION_KEYS = ['summary', 'objective', 'skills', 'experience', 'projects', 'footer'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];
export type SectionBreaks = Record<SectionKey, boolean>;

export type CvData = {
    personal: Personal;
    objective: Objective;
    summary: Summary;
    skills: SkillGroup[];
    experience: Job[];
    projects: Project[];
    education: Education[];
    certifications: Certification[];
    references: Reference[];
    sectionBreaks: SectionBreaks;
};
