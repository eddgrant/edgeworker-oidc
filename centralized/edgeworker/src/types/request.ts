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
export interface Request {
    // addHeader: string
    // arrayBuffer: string
    readonly body?: ReadableStream
    readonly cacheKey?: CacheKey
    readonly clientIp: string
    readonly cpCode: number
    readonly device?: Device
    // getHeader: string
    // getHeaders: string
    // getVariable: string
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

export class RequestBuilder {
    private body: ReadableStream;
    private cacheKey: CacheKey;
    private clientIp: string;
    private cpCode: number;
    private device: Device;
    private host: string;
    private method: string;
    private path: string;
    private query: string;
    private scheme: string;
    private url: string;
    private userLocation: UserLocation;

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

    withQuery(query: string): RequestBuilder {
        this.query = query;
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

    withUrl(url: string): RequestBuilder {
        this.url = url;
        return this;
    }

    build(): Request {
        return {
            body: this.body,
            cacheKey: this.cacheKey,
            clientIp: this.clientIp,
            cpCode: this.cpCode,
            device: this.device,
            host: this.host,
            method: this.method,
            path: this.path,
            query: this.query,
            scheme: this.scheme,
            url: this.url,
            userLocation: this.userLocation,
        }
    }
}