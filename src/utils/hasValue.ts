// Port của `has()` trong renderVals(): rỗng = null, undefined, '' hoặc mảng rỗng.
export const hasValue = <T>(value: T | null | undefined): value is T =>
    value !== null &&
    value !== undefined &&
    value !== '' &&
    !(Array.isArray(value) && value.length === 0);
