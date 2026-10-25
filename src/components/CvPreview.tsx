import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CvView } from '../utils/buildCvView';
import type { TemplatePreset } from '../templates/presets';
import AtsTemplate from './AtsTemplate';
import './CvPreview.css';

// Kích thước trang A4 ở 96dpi, khớp .cv-page trong AtsTemplate.css.
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

type CvPreviewProps = {
    view: CvView;
    preset: TemplatePreset;
};

type PageBoundary = { top: number; isForced: boolean };

// Ước lượng chỗ ngắt trang: mỗi trang dài tối đa PAGE_HEIGHT, hoặc kết thúc sớm ở chỗ ngắt chủ động.
const computeBoundaries = (height: number, forced: number[]): PageBoundary[] => {
    const result: PageBoundary[] = [];
    let start = 0;
    while (start + PAGE_HEIGHT < height - 1) {
        const limit = start + PAGE_HEIGHT;
        const nextForced = forced.find(y => y > start + 1 && y <= limit);
        const top = nextForced ?? limit;
        result.push({ top, isForced: nextForced !== undefined });
        start = top;
    }
    forced.filter(y => y > start + 1 && y < height - 1).forEach(top => {
        result.push({ top, isForced: true });
        start = top;
    });
    return result;
};

const CvPreview = ({ view, preset }: CvPreviewProps) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [boundaries, setBoundaries] = useState<PageBoundary[]>([]);

    // Đo bằng rect rồi quy về px chưa zoom, để không phụ thuộc cách trình duyệt báo kích thước khi có zoom.
    const measure = useCallback(() => {
        const frame = frameRef.current;
        const canvas = canvasRef.current;
        if (!frame || !canvas) return;
        const styles = getComputedStyle(frame);
        const available = frame.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
        setScale(Math.min(1, available / PAGE_WIDTH));

        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0) return;
        const ratio = PAGE_WIDTH / rect.width;
        const forced = Array.from(canvas.querySelectorAll<HTMLElement>('[data-break]'))
            .map(el => {
                const box = el.getBoundingClientRect();
                const edge = el.dataset.break === 'before' ? box.top : box.bottom;
                return (edge - rect.top) * ratio;
            })
            .sort((a, b) => a - b);
        setBoundaries(computeBoundaries(rect.height * ratio, forced));
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
                        <span>{b.isForced ? `Page break · end of page ${i + 1}` : `≈ End of page ${i + 1} (A4)`}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CvPreview;
