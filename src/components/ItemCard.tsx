import type { ReactNode } from 'react';
import { Card } from '@heroui/react';
import IconActions from './IconActions';
import PageBreakSwitch from './PageBreakSwitch';

type ItemCardProps = {
    title: string;
    index: number;
    total: number;
    onMove: (from: number, to: number) => void;
    onRemove: (index: number) => void;
    // Có thì hiện công tắc "Ngắt trang sau mục này" ở chân card.
    pageBreakAfter?: { isSelected: boolean; onChange: (isSelected: boolean) => void };
    children: ReactNode;
};

// Khung cho một item trong list object (job, project, education, ...): tiêu đề + lên/xuống/xoá.
const ItemCard = ({ title, index, total, onMove, onRemove, pageBreakAfter, children }: ItemCardProps) => (
    <Card variant="secondary" className="gap-0 p-0">
        <Card.Header className="flex flex-row items-center justify-between gap-2 border-b border-separator py-2 ps-4 pe-2">
            <Card.Title className="truncate text-sm font-semibold">{title}</Card.Title>
            <IconActions index={index} total={total} onMove={onMove} onRemove={onRemove} itemLabel="item" />
        </Card.Header>
        <Card.Content className="flex flex-col gap-4 p-4">{children}</Card.Content>
        {pageBreakAfter && (
            <Card.Footer className="border-t border-separator px-4 py-2.5">
                <PageBreakSwitch
                    label="Page break after this item when printing"
                    isSelected={pageBreakAfter.isSelected}
                    onChange={pageBreakAfter.onChange}
                />
            </Card.Footer>
        )}
    </Card>
);

export default ItemCard;
