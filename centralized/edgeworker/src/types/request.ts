import ResponseProviderRequest = EW.ResponseProviderRequest;
import ReadableStream = EW.ReadableStreamEW;
import Headers = EW.Headers;
import UserLocation = EW.UserLocation;
import Device = EW.Device;

export interface CacheKey {
    excludeQueryString: boolean
    includeQueryString: boolean
    includeQueryArgument: boolean
    includeCookie: boolean
    includeHeader: boolean
    includeVariable: boolean
}


// https://techdocs.akamai.com/edgeworkers/docs/request-object

class ResponseProviderRequestImpl implements ResponseProviderRequest {
    readonly body: ReadableStream;
    readonly cacheKey?: CacheKey;
    readonly clientIp: string;
    readonly cpCode: number;
    readonly device: Device | undefined;
    readonly host: string;
    readonly method: string;
    readonly path: string;
    readonly scheme: string;
    readonly query: string;
    readonly url: string;
    readonly userLocation: UserLocation;
    private readonly variables: Map<string, string> = new Map<string, string>();
    private readonly headers: Map<string, string | string[]> = new Map<string, string | string[]>();

    constructor(
        body: ReadableStream,
        cacheKey: CacheKey,
        clientIp: string,
        cpCode: number,
        device: Device | undefined,
        host: string,
        method: string,
        path: string,
        query: string,
        scheme: string,
        url: string,
        userLocation: UserLocation,
        variables: Map<string, string> = new Map<string, string>(),
        headers: Map<string, string | string[]> = new Map<string, string | string[]>()
    ) {
        this.body = body;
        this.cacheKey = cacheKey;
        this.clientIp = clientIp;
        this.cpCode = cpCode;
        this.device = device;
        this.host = host;
        this.method = method;
        this.path = path;
        this.query = query;
        this.scheme = scheme;
        this.url = url;
        this.userLocation = userLocation;
        this.variables = variables;
        this.headers = headers;
    }

    // From ReadsBody
    text(): Promise<string> {
        throw new Error('Not yet implemented')
    }

    json(): Promise<any> {
        throw new Error('Not yet implemented')
    }

    arrayBuffer(): Promise<ArrayBuffer> {
        throw new Error('Not yet implemented')
    }

    // From ReadsHeaders
    getHeader(name: string): string[] | null {
        const headerValue = this.headers.get(name);
        if (typeof headerValue === 'string') {
            return [headerValue];
        } else if (Array.isArray(headerValue)) {
            return headerValue;
        } else {
            return null;
        }
    }

    // From ReadAllHeader
    getHeaders(): Headers {
        throw new Error('Not yet implemented')
    }

    // From ReadsVariables
    getVariable(name: string): string {
        return this.variables.get(name);
    }
}

export class ResponseProviderRequestBuilder {
    private body: ReadableStream;
    private cacheKey: CacheKey;
    private clientIp: string;
    private cpCode: number;
    private device: Device | undefined;
    private host: string;
    private method: string;
    private path: string;
    private queryParams: Map<string, string> = new Map<string, string>();
    private scheme: string;
    private userLocation: UserLocation;
    private variables: Map<string, string> = new Map<string, string>();
    private headers: Map<string, string | string[]> = new Map<string, string | string[]>();

    withDefaults() {
        this.host = "example.com"
        this.path = "/hello-world"
        return this;
    }

    withMethod(method: string): ResponseProviderRequestBuilder {
        this.method = method;
        return this;
    }

    withPath(path: string): ResponseProviderRequestBuilder {
        this.path = path;
        return this;
    }

    withHost(host: string): ResponseProviderRequestBuilder {
        this.host = host;
        return this;
    }

    withScheme(scheme: string): ResponseProviderRequestBuilder {
        this.scheme = scheme;
        return this;
    }

    withQueryParam(name: string, value: string): ResponseProviderRequestBuilder {
        this.queryParams.set(name, value);
        return this;
    }

    withVariable(name: string, value: string): ResponseProviderRequestBuilder {
        this.variables.set(name, value);
        return this;
    }

    withClientIp(clientIp: string): ResponseProviderRequestBuilder {
        this.clientIp = clientIp;
        return this;
    }

    withCpCode(cpCode: number): ResponseProviderRequestBuilder {
        this.cpCode = cpCode;
        return this;
    }

    withDevice(device: Device): ResponseProviderRequestBuilder {
        this.device = device;
        return this;
    }

    withUserLocation(userLocation: UserLocation): ResponseProviderRequestBuilder {
        this.userLocation = userLocation;
        return this;
    }

    withCacheKey(cacheKey: CacheKey): ResponseProviderRequestBuilder {
        this.cacheKey = cacheKey;
        return this;
    }

    withBody(body: ReadableStream): ResponseProviderRequestBuilder {
        this.body = body;
        return this;
    }

    build(): ResponseProviderRequestImpl {
        return new ResponseProviderRequestImpl(
            this.body,
            this.cacheKey,
            this.clientIp,
            this.cpCode,
            this.device,
            this.host,
            this.method,
            this.path,
            this.getQueryParamsString(),
            this.scheme,
            `${this.path}${this.queryParams.size > 0 ? '?' + this.getQueryParamsString() : ''}`,
            this.userLocation,
            this.variables,
            this.headers
        )
    }

    private getQueryParamsString() : string {
        return Array.from(this.queryParams.entries())
            .map(kv => kv.join("="))
            .join("&")
    }
}