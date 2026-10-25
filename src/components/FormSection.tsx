import type { ReactNode } from 'react';
import { Accordion, Chip } from '@heroui/react';
import PageBreakSwitch from './PageBreakSwitch';

type FormSectionProps = {
    id: string;
    title: string;
    count?: number;
    // Có thì hiện công tắc "Bắt đầu ở trang mới" cho section này.
    pageBreak?: { isSelected: boolean; onChange: (isSelected: boolean) => void };
    children: ReactNode;
};

// Một mục trong accordion của form.
const FormSection = ({ id, title, count, pageBreak, children }: FormSectionProps) => (
    <Accordion.Item id={id}>
        <Accordion.Heading>
            <Accordion.Trigger className="gap-3">
                <span className="font-display text-base font-extrabold">{title}</span>
                {count !== undefined && (
                    <Chip size="sm" variant="soft">{count}</Chip>
                )}
                <Accordion.Indicator className="ms-auto" />
            </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
            <Accordion.Body className="flex flex-col gap-4">
                {pageBreak && (
                    <PageBreakSwitch
                        label="Start on a new page when printing"
                        isSelected={pageBreak.isSelected}
                        onChange={pageBreak.onChange}
                    />
                )}
                {children}
            </Accordion.Body>
        </Accordion.Panel>
    </Accordion.Item>
);

export default FormSection;
