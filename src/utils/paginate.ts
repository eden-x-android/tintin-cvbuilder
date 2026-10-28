// Mô phỏng cách trình duyệt chia trang A4 khi in, để vạch ngắt trang trên preview khớp bản in.
// Luật in tương ứng nằm trong AtsTemplate.css (@media print): .cv-keep, .cv-keep-next, .cv-break-*.

export type FlowBox = {
    // Mép trên nếu trang mới bắt đầu từ khối này — đã tính cả container bọc ngoài mà khối là con đầu tiên.
    top: number;
    bottom: number;
    // Tiêu đề: không được ngắt trang ngay sau khối này.
    keepWithNext: boolean;
};

export type PageBreak = { top: number; isForced: boolean };

// `boxes` theo thứ tự tài liệu, toạ độ px chưa zoom tính từ đầu trang CV (bố cục liền một dải trên màn hình).
// `forced`: vị trí các chỗ ngắt chủ động. `padding`: padding trên/dưới của trang, lặp lại ở mỗi trang khi in.
export const paginate = (boxes: FlowBox[], forced: number[], pageHeight: number, padding: number): PageBreak[] => {
    const breaks: PageBreak[] = [];
    let page = 0;
    let pageStart = 0;
    // Toạ độ khi in = toạ độ trên màn hình + shift.
    let shift = 0;

    const startPage = (index: number, isForced: boolean) => {
        breaks.push({ top: boxes[index].top, isForced });
        page += 1;
        pageStart = index;
        shift = page * pageHeight + padding - boxes[index].top;
    };

    let i = 0;
    while (i < boxes.length) {
        const box = boxes[i];
        // Khối đầu trang luôn được đặt, kể cả khi cao hơn một trang (trình duyệt cũng buộc phải cắt).
        if (i > pageStart) {
            const prevBottom = boxes[i - 1].bottom;
            if (forced.some(y => y > prevBottom - 0.5 && y <= box.top + 0.5)) {
                startPage(i, true);
                continue;
            }
            const pageBottom = (page + 1) * pageHeight - padding;
            if (box.bottom + shift > pageBottom + 0.5) {
                // Lùi về trước các tiêu đề đứng ngay trên, để tiêu đề sang trang cùng dòng đầu của nó.
                let start = i;
                while (start - 1 > pageStart && boxes[start - 1].keepWithNext) start -= 1;
                startPage(start, false);
                i = start;
                continue;
            }
        }
        i += 1;
    }
    return breaks;
};
