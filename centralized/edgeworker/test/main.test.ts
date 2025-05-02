import {describe, it, vi, expect, beforeEach} from 'vitest'
import {IResponse, ResponseBuilder} from '../src/types/response'
import {RequestBuilder} from "../src/types/request";
import {createResponse} from "create-response";

import {responseProvider} from "../src/main.js";

describe('OIDC Response Provider', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 404 for unknown path", async () => {
        // Given
        //https://bentilling.com/a-practical-guide-to-mocking-svelte-stores-with-vitest
        const responseHeaders = vi.hoisted(() => new Map<string, string>([
            ["x-foo", "x-bar"]
        ]));
        const responseStatusCode = vi.hoisted(() => 404);

        //vi.mock('create-response')
        vi.mock('response')

        vi.mock('create-response', () => {
            const response = new ResponseBuilder()
                .withStatus(responseStatusCode)
                .withHeaders(responseHeaders)
                .build()
            const responseMock = vi.mocked(response, true)
            return {
                default: {createResponse: vi.fn()},
                namedExport: vi.fn(),
                createResponse: vi.fn(() => responseMock),
            }
        })
        const request = new RequestBuilder().withDefaults().build()
        const requestMock = vi.mocked(request, true)

        // When
        const returnedResponse : IResponse = await responseProvider(requestMock);

        // Then
        expect(createResponse).toHaveBeenCalledWith(404, {'Content-Type': ['application/text']},`No route for ${request.url}`)

        expect(returnedResponse.status).toBe(responseStatusCode)
        expect(returnedResponse.getHeaders()).toStrictEqual(responseHeaders)
    });
});