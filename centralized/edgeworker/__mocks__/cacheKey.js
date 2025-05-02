import {vi} from 'vitest'

export const mockExcludeQueryString = vi.fn();
export const mockIncludeQueryString= vi.fn();
export const mockIncludeQueryArgument = vi.fn();
export const mockIncludeCookie = vi.fn();
export const mockIncludeHeader = vi.fn();
export const mockIncludeVariable = vi.fn();

const CacheKey = vi.fn().mockImplementation(() => {
  return {
    excludeQueryString: mockExcludeQueryString,
    includeQueryString: mockIncludeQueryString,
    includeQueryArgument: mockIncludeQueryArgument,
    includeCookie: mockIncludeCookie,
    includeHeader: mockIncludeHeader,
    includeVariable: mockIncludeVariable
    };
});

export default CacheKey;