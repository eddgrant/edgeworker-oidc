import {vi} from 'vitest'

import {ReadableStream} from './streams'
export const httpRequest = vi.fn();

export const mock_HttpResponse_text = vi.fn();
export const mock_HttpResponse_json = vi.fn();
export const mock_HttpResponse_getHeader = vi.fn();
export const mock_HttpResponse_getHeaders = vi.fn();
export const mock_HttpResponse_get = vi.fn();
export const mock_HttpResponse_status = vi.fn();
export const mock_HttpResponse_ok = vi.fn();

export const HttpResponse = vi.fn().mockImplementation(() => {
    return {
        status: mock_HttpResponse_status,
        ok: mock_HttpResponse_ok,
        headers: {},
        body: new ReadableStream(),
        text: mock_HttpResponse_text,
        json: mock_HttpResponse_json,
        getHeader: mock_HttpResponse_getHeader,
        getHeaders: mock_HttpResponse_getHeaders,
        get: mock_HttpResponse_get,
      };
  });
