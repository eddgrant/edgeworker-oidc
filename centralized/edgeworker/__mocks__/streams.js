import {vi} from 'vitest'

export const TransformStream = vi.fn().mockImplementation(() => {
    return {};
});

export const ByteLengthQueuingStrategy = vi.fn().mockImplementation(() => {
    return {};
});

export const CountQueuingStrategy = vi.fn().mockImplementation(() => {
    return {};
});

// ReadableStream mock
export const mock_ReadableStream_cancel = vi.fn();
export const mock_ReadableStream_getReader = vi.fn();
export const mock_ReadableStream_pipeThrough = vi.fn().mockReturnThis();
export const mock_ReadableStream_pipeTo = vi.fn();
export const mock_ReadableStream_tee = vi.fn();

export const ReadableStream = vi.fn().mockImplementation(() => {
    return {
        locked: false,
        cancel: mock_ReadableStream_cancel,
        getReader: mock_ReadableStream_getReader,
        pipeThrough: mock_ReadableStream_pipeThrough,
        pipeTo: mock_ReadableStream_pipeTo,
        tee: mock_ReadableStream_tee
    };
});

export const WritableStream = vi.fn().mockImplementation(() => {
    return {};
});
