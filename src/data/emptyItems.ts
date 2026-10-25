import type { Certification, Education, Job, MetaEntry, Project, Reference, SkillGroup } from '../types/cv';
import { createId } from '../utils/cvIds';

// Item trống khi bấm "Thêm" trong form — mỗi item có id nội bộ mới.

export const createSkillGroup = (): SkillGroup => ({ id: createId(), category: '', items: [] });

export const createJob = (): Job => ({
    id: createId(),
    company: '',
    role: '',
    startDate: null,
    endDate: null,
    responsibilities: [],
    pageBreakAfter: false,
});

export const createMetaEntry = (): MetaEntry => ({ id: createId(), key: '', value: '' });

export const createProject = (): Project => ({
    id: createId(),
    name: '',
    meta: [],
    overview: null,
    responsibilities: [],
    achievement: null,
    pageBreakAfter: false,
});

export const createEducation = (): Education => ({
    id: createId(),
    startYear: null,
    endYear: null,
    school: '',
    major: null,
    gpa: null,
});

export const createCertification = (): Certification => ({ id: createId(), year: null, name: '', issuer: null });

export const createReference = (): Reference => ({ id: createId(), name: '', position: null, email: null });
