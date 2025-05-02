import {vi} from 'vitest'

import Device from './device';
import UserLocation from './userLocation';
import CacheKey from './cacheKey';
import { ReadableStream } from './streams'

export const mockRespondWith = vi.fn();
export const mockWasTerminated = vi.fn();
export const mockGetHeader = vi.fn();
export const mockSetHeader = vi.fn();
export const mockAddHeader = vi.fn();
export const mockRemoveHeader = vi.fn();
export const mockGetHeaders = vi.fn();
export const mockGetVariable = vi.fn();
export const mockSetVariable = vi.fn();
export const mockRoute = vi.fn();
export const mockJson = vi.fn();
export const mockText = vi.fn();
export const mockArrayBuffer = vi.fn();

const Request = vi.fn().mockImplementation(() => {
  return {
    host: "www.example.com",
    method: "GET",
    path: "/helloworld",
    scheme: "https",
    query: "param1=value1&param2=value2",
    url: "/helloworld?param1=value1&param2=value2",
    userLocation: new UserLocation(),
    device: new Device(),
    cpCode: 1191398,
    clientIp: "1.1.1.1",
    cacheKey: new CacheKey(),
    respondWith: mockRespondWith,
    wasTerminated: mockWasTerminated,
    getHeader: mockGetHeader,
    setHeader: mockSetHeader,
    addHeader: mockAddHeader,
    removeHeader: mockRemoveHeader,
    getHeaders: mockGetHeaders,
    getVariable: mockGetVariable,
    setVariable: mockSetVariable,
    route: mockRoute,
    json: mockJson,
    text: mockText,
    arrayBuffer: mockArrayBuffer,
    body: new ReadableStream()
  };
});

export default Request;
