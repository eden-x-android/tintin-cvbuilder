import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CvView } from '../utils/buildCvView';
import type { TemplatePreset } from '../templates/presets';
import { paginate, type PageBreak } from '../utils/paginate';
import AtsTemplate from './AtsTemplate';
import './CvPreview.css';

// Kích thước trang A4 ở 96dpi, khớp .cv-page trong AtsTemplate.css.
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

type CvPreviewProps = {
    view: CvView;
    preset: TemplatePreset;
};

const KEEP_SELECTOR = '.cv-keep, .cv-keep-next';

// Trang mới bắt đầu ở mép trên của container ngoài cùng mà khối là con đầu tiên (vd. footer có padding-top),
// vì trình duyệt không ngắt trang giữa mép trên container và con đầu của nó.
const breakStart = (el: HTMLElement, page: HTMLElement): HTMLElement => {
    let start = el;
    while (!start.previousElementSibling && start.parentElement && start.parentElement !== page) {
        start = start.parentElement;
    }
    return start;
};

const CvPreview = ({ view, preset }: CvPreviewProps) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [boundaries, setBoundaries] = useState<PageBreak[]>([]);

    // Đo bằng rect rồi quy về px chưa zoom, để không phụ thuộc cách trình duyệt báo kích thước khi có zoom.
    const measure = useCallback(() => {
        const frame = frameRef.current;
        const canvas = canvasRef.current;
        if (!frame || !canvas) return;
        const styles = getComputedStyle(frame);
        const available = frame.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
        setScale(Math.min(1, available / PAGE_WIDTH));

        const page = canvas.querySelector<HTMLElement>('.cv-page');
        const rect = canvas.getBoundingClientRect();
        if (!page || rect.width === 0) return;
        const ratio = PAGE_WIDTH / rect.width;
        const toY = (y: number) => (y - rect.top) * ratio;

        // Chỉ lấy khối ngoài cùng (vd. dòng footer nằm trong .cv-footer-row đã là một khối).
        const boxes = Array.from(canvas.querySelectorAll<HTMLElement>(KEEP_SELECTOR))
            .filter(el => !el.parentElement?.closest(KEEP_SELECTOR))
            .map(el => ({
                top: toY(breakStart(el, page).getBoundingClientRect().top),
                bottom: toY(el.getBoundingClientRect().bottom),
                keepWithNext: el.classList.contains('cv-keep-next'),
            }));
        const forced = Array.from(canvas.querySelectorAll<HTMLElement>('[data-break]')).map(el => {
            const box = el.getBoundingClientRect();
            return toY(el.dataset.break === 'before' ? box.top : box.bottom);
        });
        setBoundaries(paginate(boxes, forced, PAGE_HEIGHT, parseFloat(getComputedStyle(page).paddingTop)));
    }, []);

    useEffect(() => {
        const frame = frameRef.current;
        const canvas = canvasRef.current;
        if (!frame || !canvas) return;
        const observer = new ResizeObserver(measure);
        observer.observe(frame);
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [measure]);

    // Bật/tắt ngắt trang không đổi chiều cao trang nên ResizeObserver không bắt được — đo lại theo dữ liệu.
    useLayoutEffect(measure, [measure, view, preset]);

    return (
        <div ref={frameRef} className="cv-preview">
            <div ref={canvasRef} className="cv-preview-canvas" style={{ zoom: scale }}>
                <AtsTemplate view={view} preset={preset} />
                {boundaries.map((b, i) => (
                    <div
                        key={i}
                        className={`cv-preview-page-break print:hidden ${b.isForced ? 'is-forced' : ''}`}
                        style={{ top: b.top }}
                    >
                        <span>{b.isForced ? `Page break · end of page ${i + 1}` : `End of page ${i + 1} (A4)`}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CvPreview;
