import { Switch } from '@heroui/react';
import { PRESENT, type Job } from '../types/cv';
import { isBefore } from '../utils/dates';
import MonthYearPicker from './MonthYearPicker';
import StringListField from './StringListField';
import TextInput from './TextInput';

type JobEditorProps = {
    job: Job;
    onChange: (job: Job) => void;
};

const JobEditor = ({ job, onChange }: JobEditorProps) => {
    const isCurrent = job.endDate === PRESENT;
    const hasInvalidRange =
        job.startDate !== null && job.endDate !== null && !isCurrent && isBefore(job.endDate, job.startDate);

    return (
        <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextInput label="Role" value={job.role} onChange={role => onChange({ ...job, role })} />
                <TextInput label="Company" value={job.company} onChange={company => onChange({ ...job, company })} />
                <MonthYearPicker
                    label="Start"
                    mode="month"
                    value={job.startDate}
                    onChange={startDate => onChange({ ...job, startDate })}
                />
                <div className="flex min-w-0 flex-col gap-2">
                    <MonthYearPicker
                        label="End"
                        mode="month"
                        value={isCurrent ? null : job.endDate}
                        placeholder={isCurrent ? 'Present' : undefined}
                        isDisabled={isCurrent}
                        errorMessage={hasInvalidRange ? 'End must be after start' : null}
                        onChange={endDate => onChange({ ...job, endDate })}
                    />
                    <Switch
                        size="sm"
                        isSelected={isCurrent}
                        onChange={isSelected => onChange({ ...job, endDate: isSelected ? PRESENT : null })}
                    >
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <span className="text-sm">I currently work here</span>
                        </Switch.Content>
                    </Switch>
                </div>
            </div>
            <StringListField
                label="Responsibilities"
                items={job.responsibilities}
                onChange={responsibilities => onChange({ ...job, responsibilities })}
            />
        </>
    );
};

export default JobEditor;
