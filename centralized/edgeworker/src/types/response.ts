export interface IResponse {
    status: number
    addHeader: (name: string, value: string) => void
    getHeader: (name: string) => string
    getHeaders: () => Map<string, string>
    removeHeader: (name: string) => void
    setHeader: (name: string, value: string) => void
}

class Response implements IResponse {
    readonly status: number;
    private readonly headers: Map<string, string> = new Map<string, string>();

    constructor(status: number, headers: Map<string, string> = new Map<string, string>()) {
        this.status = status;
        this.headers = headers;
    }

    addHeader(name: string, value: string): void {
        this.setHeader(name, value)
    }

    getHeader(name: string): string {
        return this.headers[name];
    }

    getHeaders(): Map<string, string> {
        return this.headers;
    }

    removeHeader(name: string): void {
        this.headers.delete(name)
    }

    setHeader(name: string, value: string): void {
        this.headers.set(name, value)
    }
}

export class ResponseBuilder {
    private status: number
    private headers: Map<string, string> = new Map<string, string>()

    withDefaults() {
        this.status = 200
        return this
    }

    withStatus(status: number) {
        this.status = status
        return this
    }

    withHeaders(headers: Map<string, string>) {
        this.headers = headers
        return this
    }

    build(): IResponse {
        return new Response(
            this.status,
            this.headers
        )
    }
}