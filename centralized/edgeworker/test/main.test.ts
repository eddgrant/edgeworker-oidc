/// <reference types="akamai-edgeworkers"/>

import {beforeEach, describe, expect, it, vi} from 'vitest'
import {ResponseBuilder} from '../src/types/response.js'
import {ResponseProviderRequestBuilder} from "../src/types/request.js";
import {createResponse} from "create-response";

import {responseProvider} from "../src/main.js";

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

    it("should return 404 for unknown path", async () => {
        // Given
        vi.mock('create-response')
        vi.mock('response')

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

    it("A request to /login should return an OIDC login response", async () => {
        // Given
        vi.mock('create-response')
        vi.mock('response')
        vi.mock('cookies')

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
        const returnedResponse : any = await responseProvider(requestMock);
        //TODO: Would it be valuable to make assertions on the returnedResponse?

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
    });

    it("A request to /callback returns a 400 response when no 'code' query parameter is provided", async () => {
        // Given
        vi.mock('create-response')

        const callbackPath = `${basePath}callback`;
        const request = new ResponseProviderRequestBuilder()
            .withHost(host)
            .withPath(callbackPath)
            .withQueryParam("url", oidcUrl)
            .build()
        const requestMock = vi.mocked(request, true)

        // When
        const returnedResponse : any = await responseProvider(requestMock);

        // Then
        const expectedResponseBody = {
            error: "precondition",
            description: `callback request not initiated, redirect-url:/, query:${request.query}`
        }
        expect(createResponse).toHaveBeenCalledWith(400, {'content-type': ['application/json']}, JSON.stringify(expectedResponseBody))
    })

    it("A request to /callback should return an OIDC callback response", async () => {
        //TODO: Implement this test.

        // Given
        vi.mock('create-response')
        // TODO: Mock cookies.get("oidcurl")
        // TODO: Mock params.get("code")
        // TODO: Mock request.getHeader('Cookie')
        const callbackPath = `${basePath}callback`;
        const request = new ResponseProviderRequestBuilder()
            .withHost(host)
            .withPath(callbackPath)
            .withQueryParam("url", oidcUrl)
            .withVariable("PMUSER_MANDS_AKSECRET", akamaiSecret)
            .withVariable("PMUSER_MANDS_CLIENTID", clientId)
            .withVariable("PMUSER_MANDS_SECRET", secret)
            .withVariable("PMUSER_MANDS_AUTH_URL", authUrl)
            .build()
        const requestMock = vi.mocked(request, true)

        // When
        const returnedResponse : any = await responseProvider(requestMock);
        //TODO: Would it be valuable to make assertions on the returnedResponse?

        // Then
    });
});