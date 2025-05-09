import { vi } from 'vitest';

// This array can be imported by your test file if you need to inspect instances.
export const mockSetCookieInstances: any[] = [];

export const mockedCookiesGetFunction = vi.fn()

export const Cookies = vi.fn().mockImplementation(() => ({
  get: mockedCookiesGetFunction,
  add: vi.fn(),
  toHeader: vi.fn(() => [])
}));

export const SetCookie = vi.fn().mockImplementation((options: {
  name: string,
  value: string,
  path: string,
  secure?: boolean
}) => {
  const instance = {
    name: options.name,
    value: options.value,
    path: options.path,
    secure: options.secure,
    toHeader: vi.fn(() => `__Secure-${options.name}="${options.value}"; path=${options.path}; Secure; HttpOnly`)
  };
  mockSetCookieInstances.push(instance);
  return instance;
});
