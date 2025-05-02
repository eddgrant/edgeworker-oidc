import {vi} from 'vitest'

export const mockHtmlRewritingStream = vi.fn();
export const mockOnElement = vi.fn().mockImplementation(() => {
  return {
    selector: String,
    handler: Element()
  };
});
export const mockReadableStream = vi.fn().mockReturnThis();
export const mockWritableStream = vi.fn().mockReturnThis();
export const mockWritableStreamPipeThrough = vi.fn().mockReturnThis();
export const mockAfter = vi.fn();
export const mockAppend = vi.fn();
export const mockBefore = vi.fn();
export const mockGetAttribute = vi.fn();
export const mockPrepend = vi.fn();
export const mockRemoveAttribute = vi.fn();
export const mockReplaceChildren = vi.fn();
export const mockReplaceWith = vi.fn();
export const mockSetAttribute = vi.fn();

export const Element = vi.fn().mockImplementation(() => {
  return {
    after: mockAfter,
    append: mockAppend,
    before: mockBefore,
    getAttribute: mockGetAttribute,
    prepend: mockPrepend,
    removeAttribute: mockRemoveAttribute,
    replaceChildren: mockReplaceChildren,
    replaceWith: mockReplaceWith,
    setAttribute: mockSetAttribute
  };
});

export const HtmlRewritingStream = mockHtmlRewritingStream.mockImplementation(
  () => {
    return {
      readableStream: mockReadableStream,
      writableStream: mockWritableStream,
      onElement: mockOnElement
    };
  }
);

export const ReadableStream = vi.fn().mockImplementation(() => {
  return {
    pipeThrough: mockWritableStreamPipeThrough
  };
});

export const WritableStream = vi.fn().mockImplementation(() => {
  return {
    pipeThrough: mockWritableStreamPipeThrough
  };
});
