/// <reference path="../../../../../source/System/Net/Http/IHttpRequestAdapter.d.ts" />
/// <reference path="../../../../../source/System/Net/Http/HttpMethodValue.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Uri from "../../Uri/Uri";
import DisposableBase from "../../Disposable/DisposableBase";
export default class HttpRequestFactory extends DisposableBase {
    private _http;
    protected _uriDefaults: Uri;
    constructor(_http: IHttpRequestAdapter, uriDefaults?: string | IUri);
    protected _onDispose(): void;
    uri(uri: string | IUri): HttpRequestFactory;
    params(params: QueryParamsConvertible): HttpRequestFactory;
    request<TResult>(method: HttpMethodValue, data?: any): IPromise<TResult>;
    get<TResult>(): IPromise<TResult>;
    put<TResult>(): IPromise<TResult>;
    post<TResult>(data: any): IPromise<TResult>;
    'delete'<TResult>(): IPromise<TResult>;
}
