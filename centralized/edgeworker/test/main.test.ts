/// <reference types="akamai-edgeworkers"/>

import {beforeEach, describe, expect, it, vi} from 'vitest'
import {ResponseBuilder} from '../src/types/response.js'
import {RequestBuilder} from "../src/types/request.js";
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
        const request = new RequestBuilder().withDefaults().build()
        const requestMock = vi.mocked(request, true)

        // When
        const returnedResponse : any = await responseProvider(requestMock);

        // Then
        expect(createResponse).toHaveBeenCalledWith(404, {'Content-Type': ['application/text']},`No route for ${request.url}`)
        expect(returnedResponse.status).toBe(notFoundStatusCode)
        expect(returnedResponse.getHeaders()).toStrictEqual(responseHeaders)
    });
});