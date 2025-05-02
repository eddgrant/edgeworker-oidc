import {vi} from 'vitest'

export const mock_TextEncoder_encode = vi.fn();
export const TextEncoder = vi.fn().mockImplementation(() => {
  return {
    encoding: "utf-8",
    encode: mock_TextEncoder_encode
  };
});

export const mock_TextDecoder_decode = vi.fn();
export const TextDecoder = vi.fn().mockImplementation(() => {
  return {
    fatal: false,
    ignoreBOM: false,
    encoding: "utf-8",
    decode: mock_TextDecoder_decode
  };
});

export const atob = vi.fn();
export const btoa = vi.fn();

export const mock_base64_decode = vi.fn();
export const mock_base64_encode = vi.fn();

const Base64 = vi.fn().mockImplementation(() => {
  return {
    decode: mock_base64_decode,
    encode: mock_base64_encode
  };
});

export const base64 = new Base64();

export const mock_base64url_decode = vi.fn();
export const mock_base64url_encode = vi.fn();

const Base64url = vi.fn().mockImplementation(() => {
  return {
    decode: mock_base64url_decode,
    encode: mock_base64url_encode
  };
});
export const base64url = new Base64url();

export const mock_base16_decode = vi.fn();
export const mock_base16_encode = vi.fn();

const Base16 = vi.fn().mockImplementation(() => {
  return {
    decode: mock_base16_decode,
    encode: mock_base16_encode
  };
});
export const base16 = new Base16();
