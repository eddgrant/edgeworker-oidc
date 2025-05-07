export interface ReadableStream {
    locked: boolean
    cancel: boolean
    getReader: any
    pipeThrough: any
    pipeTo: any
    tee: any
}

export interface CacheKey {
    excludeQueryString: boolean
    includeQueryString: boolean
    includeQueryArgument: boolean
    includeCookie: boolean
    includeHeader: boolean
    includeVariable: boolean
}

export interface Device {
    brandName: string
    modelName: string
    marketingName: string
    isWireless: boolean
    isTablet: boolean
    os: string
    osVersion: string
    mobileBrowser: string
    mobileBrowserVersion: string
    resolutionWidth: bigint
    resolutionHeight: bigint
    physicalScreenHeight: bigint
    physicalScreenWidth: bigint
    hasCookieSupport: boolean
    hasAjaxSupport: boolean
    hasFlashSupport: boolean
    acceptsThirdPartyCookie: boolean
    xhtmlSupportLevel: bigint
    isMobile: boolean
}

export interface UserLocation {
    latitude: string
    longitude: string
    continent: string
    country: string
    region: string
    city: string
    zipCode: string
    dma: string
    timezone: string
    networkType: string
    bandwidth: string
    areaCodes: string[]
    fips: string[]
}

// https://techdocs.akamai.com/edgeworkers/docs/request-object
export interface IRequest {
    // addHeader: string
    // arrayBuffer: string
    readonly body?: ReadableStream
    readonly cacheKey?: CacheKey
    readonly clientIp: string
    readonly cpCode: number
    readonly device?: Device
    // getHeader: string
    // getHeaders: string
    readonly getVariable: (name: string) => string
    readonly host: string
    // json: string
    readonly method: string
    readonly path: string
    readonly query: string
    // removeHeader: string
    // respondWith: string
    // route: string
    readonly scheme: string
    // setHeader: string
    // setVariable: string
    // text: string
    readonly url: string
    readonly userLocation?: UserLocation
    //wasTerminated: boolean
}

class Request implements IRequest {
    readonly body?: ReadableStream;
    readonly cacheKey?: CacheKey;
    readonly clientIp: string;
    readonly cpCode: number;
    readonly device?: Device;
    readonly host: string;
    readonly method: string;
    readonly path: string;
    readonly query: string;
    readonly scheme: string;
    readonly url: string;
    readonly userLocation?: UserLocation;
    private readonly variables: Map<string, string> = new Map<string, string>();

    constructor(
        body: ReadableStream,
        cacheKey: CacheKey,
        clientIp: string,
        cpCode: number,
        device: Device,
        host: string,
        method: string,
        path: string,
        query: string,
        scheme: string,
        url: string,
        userLocation: UserLocation,
        variables: Map<string, string> = new Map<string, string>()
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
    }

    getVariable(name: string): string {
        return this.variables.get(name);
    }

}

export class RequestBuilder {
    private body: ReadableStream;
    private cacheKey: CacheKey;
    private clientIp: string;
    private cpCode: number;
    private device: Device;
    private host: string;
    private method: string;
    private path: string;
    private queryParams: Map<string, string> = new Map<string, string>();
    private scheme: string;
    private userLocation: UserLocation;
    private variables: Map<string, string> = new Map<string, string>();

    withDefaults() {
        this.host = "example.com"
        this.path = "/hello-world"
        return this;
    }

    withMethod(method: string): RequestBuilder {
        this.method = method;
        return this;
    }

    withPath(path: string): RequestBuilder {
        this.path = path;
        return this;
    }

    withHost(host: string): RequestBuilder {
        this.host = host;
        return this;
    }

    withScheme(scheme: string): RequestBuilder {
        this.scheme = scheme;
        return this;
    }

    withQueryParam(name: string, value: string): RequestBuilder {
        this.queryParams.set(name, value);
        return this;
    }

    withVariable(name: string, value: string): RequestBuilder {
        this.variables.set(name, value);
        return this;
    }

    withClientIp(clientIp: string): RequestBuilder {
        this.clientIp = clientIp;
        return this;
    }

    withCpCode(cpCode: number): RequestBuilder {
        this.cpCode = cpCode;
        return this;
    }

    withDevice(device: Device): RequestBuilder {
        this.device = device;
        return this;
    }

    withUserLocation(userLocation: UserLocation): RequestBuilder {
        this.userLocation = userLocation;
        return this;
    }

    withCacheKey(cacheKey: CacheKey): RequestBuilder {
        this.cacheKey = cacheKey;
        return this;
    }

    withBody(body: ReadableStream): RequestBuilder {
        this.body = body;
        return this;
    }

    build(): IRequest {
        return new Request(
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
            this.variables
        )
    }

    private getQueryParamsString() : string {
        return Array.from(this.queryParams.entries())
            .map(kv => kv.join("="))
            .join("&")
    }
}