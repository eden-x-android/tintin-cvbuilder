import type { Project } from '../types/cv';
import { toNullable } from '../utils/listOps';
import MetaEditor from './MetaEditor';
import RichTextArea from './RichTextArea';
import StringListField from './StringListField';
import TextInput from './TextInput';

type ProjectEditorProps = {
    project: Project;
    onChange: (project: Project) => void;
};

const ProjectEditor = ({ project, onChange }: ProjectEditorProps) => (
    <>
        <TextInput label="Project name" value={project.name} onChange={name => onChange({ ...project, name })} />
        <MetaEditor items={project.meta} onChange={meta => onChange({ ...project, meta })} />
        <RichTextArea
            label="Overview"
            value={project.overview}
            onChange={value => onChange({ ...project, overview: toNullable(value) })}
        />
        <StringListField
            label="Responsibilities"
            items={project.responsibilities}
            onChange={responsibilities => onChange({ ...project, responsibilities })}
        />
        <RichTextArea
            label="Result"
            value={project.achievement}
            rows={2}
            placeholder="Optional"
            onChange={value => onChange({ ...project, achievement: toNullable(value) })}
        />
    </>
);

export default ProjectEditor;
