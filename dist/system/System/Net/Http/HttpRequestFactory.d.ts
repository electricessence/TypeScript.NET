/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { QueryParam } from "../../Uri/QueryParam";
import { DisposableBase } from "../../Disposable/DisposableBase";
import { HttpMethodValue } from "./HttpMethodValue";
import { Uri } from "../../Uri/Uri";
import { IUri } from "../../Uri/IUri";
import { IHttpRequestAdapter } from "./IHttpRequestAdapter";
/**
 * This class exposes a factory for making requests to prepared uri and params.
 */
export declare class HttpRequestFactory extends DisposableBase {
    private _http;
    protected _uriDefaults: Uri;
    constructor(_http: IHttpRequestAdapter, uriDefaults?: string | IUri);
    protected _onDispose(): void;
    uri(uri: string | IUri): HttpRequestFactory;
    params(params: QueryParam.Convertible): HttpRequestFactory;
    request<TResult>(method: HttpMethodValue.Any, data?: any): PromiseLike<TResult>;
    get<TResult>(): PromiseLike<TResult>;
    put<TResult>(): PromiseLike<TResult>;
    post<TResult>(data: any): PromiseLike<TResult>;
    'delete'<TResult>(): PromiseLike<TResult>;
}
export default HttpRequestFactory;
