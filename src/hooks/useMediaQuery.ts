import { useSyncExternalStore } from 'react';

// Theo dõi một media query, ví dụ để đổi popover thành bottom sheet trên màn hình hẹp.
export const useMediaQuery = (query: string): boolean =>
    useSyncExternalStore(
        onChange => {
            const media = window.matchMedia(query);
            media.addEventListener('change', onChange);
            return () => media.removeEventListener('change', onChange);
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
