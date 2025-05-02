import {IResponse} from "./types/response";
import {Request} from "./types/request";

export function responseProvider(request: Request): Promise<IResponse>;
