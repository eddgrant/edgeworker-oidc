/// <reference types="akamai-edgeworkers"/>

import {beforeEach, describe, expect, it, vi} from 'vitest'
import {ResponseBuilder} from '../src/types/response.js'
import {ResponseProviderRequestBuilder} from "../src/types/request.js";
import {createResponse} from "create-response";

import {responseProvider} from "../src/main.js";
import {mockedCookiesGetFunction, mockSetCookieInstances} from "cookies";
import {httpRequest, HttpResponse} from "http-request"

const responseHeaders = new Map<string, string>([
    ["x-foo", "x-bar"]
]);
const notFoundStatusCode = 404;
const host = "www.marksandspencer.com";
const basePath = "/mands/";
const akamaiSecret = "This is my Akamai Secret"
const clientId = "This is my Client Id"
const secret = "This is my Secret"
const authScheme = "https"
const authHost = "www.this-is-my-auth-url.com"
const authPath = "/foo"
const authUrl = `${authScheme}://${authHost}${authPath}`
const oidcUrl = "https://this-is-my-oidc-url.com/"

describe('OIDC Response Provider', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("404 tests", () => {
        it("A request to an unsupported path returns a 404 response", async () => {
            // Given
            vi.mock('create-response')
            vi.mock('response')
            vi.mock("url-search-params")

            createResponse.mockImplementation(function () {
                return new ResponseBuilder().withStatus(notFoundStatusCode).withHeaders(responseHeaders).build()
            })
            const request = new ResponseProviderRequestBuilder().withDefaults().build()
            const requestMock = vi.mocked(request, true)

            // When
            const returnedResponse : any = await responseProvider(requestMock);

            // Then
            expect(createResponse).toHaveBeenCalledWith(404, {'Content-Type': ['application/text']},`No route for ${request.url}`)
            expect(returnedResponse.status).toBe(notFoundStatusCode)
            expect(returnedResponse.getHeaders()).toStrictEqual(responseHeaders)
        });
    });

    describe("/login tests", () => {
        it("A request to /login returns an OIDC login response", async () => {
            // Given
            vi.mock('create-response')
            vi.mock('response')
            vi.mock('cookies')
            vi.mock("url-search-params")

            const loginPath = `${basePath}login`;
            const request = new ResponseProviderRequestBuilder()
                .withHost(host)
                .withPath(loginPath)
                .withQueryParam("url", oidcUrl)
                .withVariable("PMUSER_MANDS_AKSECRET", akamaiSecret)
                .withVariable("PMUSER_MANDS_CLIENTID", clientId)
                .withVariable("PMUSER_MANDS_SECRET", secret)
                .withVariable("PMUSER_MANDS_AUTH_URL", authUrl)
                .build()
            const requestMock = vi.mocked(request, true)

            // When
            await responseProvider(requestMock);

            // Then
            const createResponseCalls = createResponse.mock.calls
            expect(createResponseCalls.length).toBe(1);

            const createResponseCallArguments = createResponseCalls[0]
            const statusCode = createResponseCallArguments[0]
            expect(statusCode).toBe(302)

            const responseHeaders = createResponseCallArguments[1]
            const setCookieResponseHeaders = responseHeaders['set-cookie']
            expect(setCookieResponseHeaders.length).toBe(2)

            const oidcCookieResponseHeader = setCookieResponseHeaders[0]
            // This is a rather crude way of asserting that the expected parameters were passed to the SetCookie constructor.
            expect(oidcCookieResponseHeader).toBe(`__Secure-oidcurl="${oidcUrl}"; path=${basePath}; Secure; HttpOnly`)

            const nonceResponseHeader = setCookieResponseHeaders[1]
            // This is a rather crude way of asserting that the expected parameters were passed to the SetCookie constructor.
            expect(nonceResponseHeader).toMatch(new RegExp(`^__Secure-nonce="[a-z0-9]{8}"; path=${basePath}; Secure; HttpOnly$`))

            const locationResponseHeader = new URL(responseHeaders['location'][0])
            expect(locationResponseHeader.protocol).toMatch(new RegExp(`^${authScheme}?`))
            expect(locationResponseHeader.host).toMatch(authHost)
            expect(locationResponseHeader.pathname).toMatch(authPath)
            expect(locationResponseHeader.searchParams.get("client_id")).toMatch(clientId)
            expect(locationResponseHeader.searchParams.get("nonce").length).toBe(8)
            expect(locationResponseHeader.searchParams.get("redirect_uri")).toMatch(`https://${host}${basePath}callback`)
            expect(locationResponseHeader.searchParams.get("response_type")).toMatch("code")
            expect(locationResponseHeader.searchParams.get("scope")).toMatch("openid email")

            const providedBody = createResponseCallArguments[2]
            expect(providedBody).toEqual("")
        })
    });

    describe("/callback tests", () => {
        it("A request to /callback returns a 400 response when no 'code' query parameter is provided", async () => {
            // Given
            vi.mock('create-response')
            vi.mock("url-search-params")

            const callbackPath = `${basePath}callback`;
            const request = new ResponseProviderRequestBuilder()
                .withHost(host)
                .withPath(callbackPath)
                .withQueryParam("url", oidcUrl)
                .build()
            const requestMock = vi.mocked(request, true)

            // When
            await responseProvider(requestMock);

            // Then
            const expectedResponseBody = {
                error: "precondition",
                description: `callback request not initiated, redirect-url:/, query:${request.query}`
            }
            expect(createResponse).toHaveBeenCalledWith(400, {'content-type': ['application/json']}, JSON.stringify(expectedResponseBody))
        })

        it("A request to /callback returns a 403 response when the nonce in the JWT does not match the nonse in the cookie header ", async () => {
            // Given
            vi.mock('create-response')
            vi.mock('cookies')
            vi.mock('http-request')
            vi.mock("url-search-params")

            mockedCookiesGetFunction.mockReturnValueOnce(oidcUrl)
            mockedCookiesGetFunction.mockReturnValueOnce("ANonceValue")
            const httpResponse = new HttpResponse()
            httpResponse.ok.mockReturnedValueOnce = true
            httpResponse.status.mockReturnedValueOnce = 200
            const header = JSON.stringify({})
            const payload = JSON.stringify({nonce: "ADifferentNonceValue"})
            const signature = "signature"
            httpResponse.json.mockResolvedValueOnce(Promise.resolve({id_token: `${btoa(header)}.${btoa(payload)}.${signature}`}))

            httpRequest.mockResolvedValueOnce(Promise.resolve(httpResponse))

            const code = "this-is-my-code"
            const callbackPath = `${basePath}callback`;
            const request = new ResponseProviderRequestBuilder()
                .withHost(host)
                .withPath(callbackPath)
                .withQueryParam("url", oidcUrl)
                .withQueryParam("code", code)
                .withVariable("PMUSER_MANDS_AKSECRET", akamaiSecret)
                .withVariable("PMUSER_MANDS_CLIENTID", clientId)
                .withVariable("PMUSER_MANDS_SECRET", secret)
                .withVariable("PMUSER_MANDS_AUTH_URL", authUrl)
                .build()
            const requestMock = vi.mocked(request, true)

            // When
            await responseProvider(requestMock);

            // Then
            expect(createResponse).toHaveBeenCalledWith(403, {}, "Nonce failed")
        })

        it("A request to /callback returns a 302 response, containing a secure token Cookie", async () => {
            // Given
            vi.mock('create-response')
            vi.mock('cookies')
            vi.mock('http-request')
            vi.mock("url-search-params")

            const nonceValue = "this-is-my-nonce-value"
            mockedCookiesGetFunction.mockReturnValueOnce(oidcUrl)
            mockedCookiesGetFunction.mockReturnValueOnce(nonceValue)
            const httpResponse = new HttpResponse()
            httpResponse.ok.mockReturnedValueOnce = true
            httpResponse.status.mockReturnedValueOnce = 200
            const header = JSON.stringify({})
            const payload = JSON.stringify({nonce: nonceValue, email: "me@my-domain.com", hd: "this-is-my-salt-value"})
            const signature = "signature"
            httpResponse.json.mockResolvedValueOnce({
                id_token: `${btoa(header)}.${btoa(payload)}.${signature}`,
                expires_in: 3600
            })

            httpRequest.mockResolvedValueOnce(httpResponse)

            const code = "this-is-my-code"
            const callbackPath = `${basePath}callback`;
            const request = new ResponseProviderRequestBuilder()
                .withHost(host)
                .withPath(callbackPath)
                .withQueryParam("url", oidcUrl)
                .withQueryParam("code", code)
                .withVariable("PMUSER_MANDS_AKSECRET", akamaiSecret)
                .withVariable("PMUSER_MANDS_CLIENTID", clientId)
                .withVariable("PMUSER_MANDS_SECRET", secret)
                .withVariable("PMUSER_MANDS_AUTH_URL", authUrl)
                .build()
            const requestMock = vi.mocked(request, true)

            // When
            await responseProvider(requestMock);

            // Then
            //TODO: Assert as much as possible on the Set-Cookie response header.
            expect(createResponse).toHaveBeenCalledWith(302, {"Set-Cookie": expect.any(Array<String>), "Location": [oidcUrl]}, "")
        })

    });
});