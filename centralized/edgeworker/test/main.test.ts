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
        vi.mock('cookies')
        vi.mock('create-response')
        vi.mock('response')

        const host = "www.marksandspencer.com";
        const basePath = "/mands";
        const path = `${basePath}/login`;
        const akamaiSecret = "This is my Akamai Secret"
        const clientId = "This is my Client Id"
        const secret = "This is my Secret"
        const authScheme = "https"
        const authHost = "www.this-is-my-auth-url.com"
        const authPath = "/foo"
        const authUrl = `${authScheme}://${authHost}${authPath}`
        const request = new ResponseProviderRequestBuilder()
            .withHost(host)
            .withPath(path)
            .withVariable("PMUSER_MANDS_AKSECRET", akamaiSecret)
            .withVariable("PMUSER_MANDS_CLIENTID", clientId)
            .withVariable("PMUSER_MANDS_SECRET", secret)
            .withVariable("PMUSER_MANDS_AUTH_URL", authUrl)
            .build()
        const requestMock = vi.mocked(request, true)

        // When
        const returnedResponse : any = await responseProvider(requestMock);

        // Then
        const createResponseCalls = createResponse.mock.calls
        expect(createResponseCalls.length).toBe(1);

        const createResponseCallArguments = createResponseCalls[0]
        const providedStatusCode = createResponseCallArguments[0]
        expect(providedStatusCode).toBe(302)

        const providedResponseHeaders = createResponseCallArguments[1]
        const setCookieResponseHeader = providedResponseHeaders['set-cookie'][0]
        expect(setCookieResponseHeader).toBeUndefined() //TODO: This is probably wrong and needs to be updated.

        const locationResponseHeader = new URL(providedResponseHeaders['location'][0])
        expect(locationResponseHeader.protocol).toMatch(new RegExp(`^${authScheme}?`))
        expect(locationResponseHeader.host).toMatch(authHost)
        expect(locationResponseHeader.pathname).toMatch(authPath)
        expect(locationResponseHeader.searchParams.get("client_id")).toMatch(clientId)
        expect(locationResponseHeader.searchParams.get("nonce").length).toBe(8)
        expect(locationResponseHeader.searchParams.get("redirect_uri")).toMatch(`https://${host}${basePath}/callback`)
        expect(locationResponseHeader.searchParams.get("response_type")).toMatch("code")
        expect(locationResponseHeader.searchParams.get("scope")).toMatch("openid email")

        const providedBody = createResponseCallArguments[2]
    });
});