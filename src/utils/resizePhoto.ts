// Ảnh hiển thị ở ô 88×88px; lưu 4× (352px) cho bản in sắc nét mà JSON vẫn nhẹ.
const PHOTO_SIZE = 352;

// Cắt vuông chính giữa rồi thu nhỏ, trả về data URL JPEG để nhúng vào CvData.
export const resizePhoto = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            const side = Math.min(img.naturalWidth, img.naturalHeight);
            const canvas = document.createElement('canvas');
            canvas.width = PHOTO_SIZE;
            canvas.height = PHOTO_SIZE;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('This browser does not support canvas'));
                return;
            }
            ctx.drawImage(
                img,
                (img.naturalWidth - side) / 2,
                (img.naturalHeight - side) / 2,
                side,
                side,
                0,
                0,
                PHOTO_SIZE,
                PHOTO_SIZE,
            );
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Couldn't read the image file"));
        };
        img.src = url;
    });
