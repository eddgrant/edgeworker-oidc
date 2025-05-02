import {vi} from 'vitest'

export const mockGetHeader = vi.fn();
export const mockSetHeader = vi.fn();
export const mockAddHeader = vi.fn();
export const mockRemoveHeader= vi.fn();
export const mockGetHeaders = vi.fn();

const Response = vi.fn().mockImplementation(() => {
  return {
    status: "200",
    getHeader: mockGetHeader,
    setHeader: mockSetHeader,
    addHeader: mockAddHeader,
    removeHeader: mockRemoveHeader,
    getHeaders: mockGetHeaders,
    };
});

export default Response;
