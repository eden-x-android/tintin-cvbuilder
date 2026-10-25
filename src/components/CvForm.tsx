import type { ReactNode } from 'react';
import { Accordion } from '@heroui/react';
import type { CvData, ObjectiveEntry, Personal, SectionKey } from '../types/cv';
import {
    createCertification,
    createEducation,
    createJob,
    createProject,
    createReference,
    createSkillGroup,
} from '../data/emptyItems';
import { moveItem, removeAt, replaceAt, toNullable } from '../utils/listOps';
import AddButton from './AddButton';
import FormSection from './FormSection';
import ItemCard from './ItemCard';
import JobEditor from './JobEditor';
import MonthYearPicker from './MonthYearPicker';
import PhotoField from './PhotoField';
import ProjectEditor from './ProjectEditor';
import RichTextArea from './RichTextArea';
import StringListField from './StringListField';
import TextInput from './TextInput';

type CvFormProps = {
    data: CvData;
    onChange: (data: CvData) => void;
};

type ListKey = 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'references';
type ObjectiveKey = keyof CvData['objective'];

const OBJECTIVE_FIELDS: { key: ObjectiveKey; title: string }[] = [
    { key: 'shortTerm', title: 'Short term' },
    { key: 'longTerm', title: 'Long term' },
];

const CvForm = ({ data, onChange }: CvFormProps) => {
    const { personal } = data;

    const handlePersonalChange = (patch: Partial<Personal>) =>
        onChange({ ...data, personal: { ...personal, ...patch } });

    const handleObjectiveChange = (key: ObjectiveKey, patch: Partial<ObjectiveEntry>) =>
        onChange({ ...data, objective: { ...data.objective, [key]: { ...data.objective[key], ...patch } } });

    const handleListChange = <K extends ListKey>(key: K, items: CvData[K]) => onChange({ ...data, [key]: items });

    const handleItemChange = <K extends ListKey>(key: K, index: number, patch: Partial<CvData[K][number]>) => {
        const items: readonly CvData[K][number][] = data[key];
        handleListChange(key, replaceAt(items, index, { ...items[index], ...patch }) as CvData[K]);
    };

    const sectionBreak = (key: SectionKey) => ({
        isSelected: data.sectionBreaks[key],
        onChange: (isSelected: boolean) =>
            onChange({ ...data, sectionBreaks: { ...data.sectionBreaks, [key]: isSelected } }),
    });

    // Props dùng chung cho ItemCard của một list cấp 1.
    // TS không thu hẹp được union CvData[K] trong generic, nên đi qua unknown[] rồi ép lại đúng kiểu của key.
    const cardProps = <K extends ListKey>(key: K, index: number) => {
        const items: readonly unknown[] = data[key];
        return {
            index,
            total: items.length,
            onMove: (from: number, to: number) => handleListChange(key, moveItem(items, from, to) as CvData[K]),
            onRemove: (i: number) => handleListChange(key, removeAt(items, i) as CvData[K]),
        };
    };

    const list = (children: ReactNode) => <div className="flex flex-col gap-3">{children}</div>;

    return (
        <Accordion allowsMultipleExpanded variant="surface" defaultExpandedKeys={['personal']} className="w-full">
            <FormSection id="personal" title="Personal info">
                <PhotoField photo={personal.photo} onChange={photo => handlePersonalChange({ photo })} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextInput label="Full name" value={personal.fullName} onChange={fullName => handlePersonalChange({ fullName })} />
                    <TextInput label="Job title" value={personal.title} onChange={title => handlePersonalChange({ title })} />
                    <TextInput
                        label="Email"
                        type="email"
                        value={personal.email}
                        onChange={value => handlePersonalChange({ email: toNullable(value) })}
                    />
                    <TextInput
                        label="Phone"
                        type="tel"
                        value={personal.phone}
                        onChange={value => handlePersonalChange({ phone: toNullable(value) })}
                    />
                    <TextInput
                        label="Date of birth"
                        value={personal.dateOfBirth}
                        placeholder="August 15, 2002"
                        onChange={value => handlePersonalChange({ dateOfBirth: toNullable(value) })}
                    />
                    <TextInput
                        label="Location"
                        value={personal.location}
                        onChange={value => handlePersonalChange({ location: toNullable(value) })}
                    />
                    <TextInput
                        label="LinkedIn label"
                        value={personal.linkedin.label}
                        placeholder="LinkedIn"
                        onChange={value => handlePersonalChange({ linkedin: { ...personal.linkedin, label: toNullable(value) } })}
                    />
                    <TextInput
                        label="LinkedIn URL"
                        type="url"
                        value={personal.linkedin.url}
                        onChange={value => handlePersonalChange({ linkedin: { ...personal.linkedin, url: toNullable(value) } })}
                    />
                </div>
            </FormSection>

            <FormSection id="summary" title="Summary" count={data.summary.items.length} pageBreak={sectionBreak('summary')}>
                <StringListField
                    label="Key points"
                    items={data.summary.items}
                    onChange={items => onChange({ ...data, summary: { ...data.summary, items } })}
                />
            </FormSection>

            <FormSection id="objective" title="Objective" pageBreak={sectionBreak('objective')}>
                {OBJECTIVE_FIELDS.map(({ key, title }) => (
                    <div key={key} className="flex flex-col gap-3 border-b border-separator pb-4 last:border-b-0 last:pb-0">
                        <span className="font-display text-sm font-extrabold uppercase tracking-wide text-muted">{title}</span>
                        <TextInput
                            label="Heading"
                            value={data.objective[key].label}
                            onChange={label => handleObjectiveChange(key, { label })}
                        />
                        <RichTextArea
                            label="Paragraph (optional)"
                            value={data.objective[key].text}
                            rows={2}
                            onChange={value => handleObjectiveChange(key, { text: toNullable(value) })}
                        />
                        <StringListField
                            label="Bullet points"
                            items={data.objective[key].items}
                            onChange={items => handleObjectiveChange(key, { items })}
                        />
                    </div>
                ))}
            </FormSection>

            <FormSection id="skills" title="Skills" count={data.skills.length} pageBreak={sectionBreak('skills')}>
                {list(data.skills.map((group, i) => (
                    <ItemCard key={group.id} title={group.category || `Group ${i + 1}`} {...cardProps('skills', i)}>
                        <TextInput label="Group" value={group.category} onChange={category => handleItemChange('skills', i, { category })} />
                        <StringListField
                            label="Skills"
                            items={group.items}
                            isMultiline={false}
                            allowsLinks={false}
                            addLabel="Add skill"
                            onChange={items => handleItemChange('skills', i, { items })}
                        />
                    </ItemCard>
                )))}
                <AddButton label="Add skill group" onPress={() => handleListChange('skills', [...data.skills, createSkillGroup()])} />
            </FormSection>

            <FormSection id="experience" title="Experience" count={data.experience.length} pageBreak={sectionBreak('experience')}>
                {list(data.experience.map((job, i) => (
                    <ItemCard
                        key={job.id}
                        title={[job.role, job.company].filter(Boolean).join(' · ') || `Job ${i + 1}`}
                        pageBreakAfter={{
                            isSelected: job.pageBreakAfter,
                            onChange: pageBreakAfter => handleItemChange('experience', i, { pageBreakAfter }),
                        }}
                        {...cardProps('experience', i)}
                    >
                        <JobEditor job={job} onChange={next => handleListChange('experience', replaceAt(data.experience, i, next))} />
                    </ItemCard>
                )))}
                <AddButton label="Add job" onPress={() => handleListChange('experience', [...data.experience, createJob()])} />
            </FormSection>

            <FormSection id="projects" title="Projects" count={data.projects.length} pageBreak={sectionBreak('projects')}>
                {list(data.projects.map((project, i) => (
                    <ItemCard
                        key={project.id}
                        title={project.name || `Project ${i + 1}`}
                        pageBreakAfter={{
                            isSelected: project.pageBreakAfter,
                            onChange: pageBreakAfter => handleItemChange('projects', i, { pageBreakAfter }),
                        }}
                        {...cardProps('projects', i)}
                    >
                        <ProjectEditor project={project} onChange={next => handleListChange('projects', replaceAt(data.projects, i, next))} />
                    </ItemCard>
                )))}
                <AddButton label="Add project" onPress={() => handleListChange('projects', [...data.projects, createProject()])} />
            </FormSection>

            <FormSection
                id="education"
                title="Education"
                count={data.education.length}
                pageBreak={sectionBreak('footer')}
            >
                <p className="text-xs text-muted">
                    Education, Certifications and References print as one block at the end of the CV, so this page break applies to the whole block.
                </p>
                {list(data.education.map((edu, i) => (
                    <ItemCard key={edu.id} title={edu.school || `School ${i + 1}`} {...cardProps('education', i)}>
                        <TextInput label="School" value={edu.school} onChange={school => handleItemChange('education', i, { school })} />
                        <TextInput
                            label="Major"
                            value={edu.major}
                            onChange={value => handleItemChange('education', i, { major: toNullable(value) })}
                        />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <MonthYearPicker
                                label="Start year"
                                mode="year"
                                value={edu.startYear}
                                onChange={startYear => handleItemChange('education', i, { startYear })}
                            />
                            <MonthYearPicker
                                label="End year"
                                mode="year"
                                value={edu.endYear}
                                errorMessage={
                                    edu.startYear && edu.endYear && edu.endYear < edu.startYear ? 'Must be after the start year' : null
                                }
                                onChange={endYear => handleItemChange('education', i, { endYear })}
                            />
                            <TextInput
                                label="GPA"
                                value={edu.gpa}
                                placeholder="3.12/4"
                                onChange={value => handleItemChange('education', i, { gpa: toNullable(value) })}
                            />
                        </div>
                    </ItemCard>
                )))}
                <AddButton label="Add school" onPress={() => handleListChange('education', [...data.education, createEducation()])} />
            </FormSection>

            <FormSection id="certifications" title="Certifications" count={data.certifications.length}>
                {list(data.certifications.map((cert, i) => (
                    <ItemCard key={cert.id} title={cert.name || `Certification ${i + 1}`} {...cardProps('certifications', i)}>
                        <TextInput label="Certification name" value={cert.name} onChange={name => handleItemChange('certifications', i, { name })} />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <MonthYearPicker
                                label="Year"
                                mode="year"
                                value={cert.year}
                                onChange={year => handleItemChange('certifications', i, { year })}
                            />
                            <TextInput
                                label="Issuer"
                                value={cert.issuer}
                                placeholder="Optional"
                                onChange={value => handleItemChange('certifications', i, { issuer: toNullable(value) })}
                            />
                        </div>
                    </ItemCard>
                )))}
                <AddButton
                    label="Add certification"
                    onPress={() => handleListChange('certifications', [...data.certifications, createCertification()])}
                />
            </FormSection>

            <FormSection id="references" title="References" count={data.references.length}>
                {list(data.references.map((ref, i) => (
                    <ItemCard key={ref.id} title={ref.name || `Reference ${i + 1}`} {...cardProps('references', i)}>
                        <TextInput label="Name" value={ref.name} onChange={name => handleItemChange('references', i, { name })} />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <TextInput
                                label="Position"
                                value={ref.position}
                                onChange={value => handleItemChange('references', i, { position: toNullable(value) })}
                            />
                            <TextInput
                                label="Email"
                                type="email"
                                value={ref.email}
                                onChange={value => handleItemChange('references', i, { email: toNullable(value) })}
                            />
                        </div>
                    </ItemCard>
                )))}
                <AddButton label="Add reference" onPress={() => handleListChange('references', [...data.references, createReference()])} />
            </FormSection>
        </Accordion>
    );
};

export default CvForm;
