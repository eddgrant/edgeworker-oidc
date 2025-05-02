import {vi} from 'vitest'

export const mock_Cookies_toHeader = vi.fn();
export const mock_Cookies_get = vi.fn();
export const mock_Cookies_getAll = vi.fn();
export const mock_Cookies_names = vi.fn();
export const mock_Cookies_add = vi.fn();
export const mock_Cookies_delete = vi.fn();

export const Cookies = vi.fn().mockImplementation(() => {
    return {
      toHeader: mock_Cookies_toHeader,
      get: mock_Cookies_get,
      getAll: mock_Cookies_getAll,
      names: mock_Cookies_names,
      add: mock_Cookies_add,
      delete: mock_Cookies_delete,
      };
  });


export const mock_SetCookie_toHeader = vi.fn();

export const SetCookie = vi.fn().mockImplementation(() => {
    return {
      name: 'c',
      value: '',
      maxAge: 100,
      domain: '',
      path: 'c',
      expires: '',
      httpOnly: false,
      secure: false,
      sameSite: '',
      toHeader: mock_SetCookie_toHeader,
      };
  });
