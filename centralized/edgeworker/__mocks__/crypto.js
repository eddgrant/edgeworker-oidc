import {vi} from 'vitest'

//subtle object
export const mock_crypto_subtle_digest = vi.fn();
export const mock_crypto_subtle_importKey = vi.fn();
export const mock_crypto_subtle_encrypt = vi.fn();
export const mock_crypto_subtle_decrypt = vi.fn();
export const mock_crypto_subtle_sign = vi.fn();
export const mock_crypto_subtle_verify = vi.fn();

const Subtle = vi.fn().mockImplementation(() => {
    return {
        digest: mock_crypto_subtle_digest,
        importKey: mock_crypto_subtle_importKey,
        encrypt: mock_crypto_subtle_encrypt,
        decrypt: mock_crypto_subtle_decrypt,
        sign: mock_crypto_subtle_sign,
        verify: mock_crypto_subtle_verify
    };
});

//crypto object
export const mock_crypto_getRandomValues = vi.fn();

const Crypto = vi.fn().mockImplementation(() => {
    return {
        getRandomValues: mock_crypto_getRandomValues,
        subtle: new Subtle()
    }
});
export const crypto = new Crypto();

//are not property of either crypto or subtle
export const mock_pem2ab = vi.fn();
export const pem2ab = mock_pem2ab;
