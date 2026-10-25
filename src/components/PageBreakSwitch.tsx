import { Switch } from '@heroui/react';

type PageBreakSwitchProps = {
    label: string;
    isSelected: boolean;
    onChange: (isSelected: boolean) => void;
};

// Công tắc ngắt trang chủ động khi in (theo section hoặc theo từng mục).
const PageBreakSwitch = ({ label, isSelected, onChange }: PageBreakSwitchProps) => (
    <Switch size="sm" isSelected={isSelected} onChange={onChange}>
        <Switch.Content>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
            <span className="text-sm text-muted">{label}</span>
        </Switch.Content>
    </Switch>
);

export default PageBreakSwitch;
