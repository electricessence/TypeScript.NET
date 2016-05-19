/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as QueryParam from "../../Uri/QueryParam";
import { DisposableBase } from "../../Disposable/DisposableBase";
import { HttpMethodValue } from "./HttpMethodValue";
import { Uri } from "../../Uri/Uri";
import { IUri } from "../../Uri/IUri";
import { IHttpRequestAdapter } from "./IHttpRequestAdapter";
import { IPromise } from "../../Promises/IPromise";
export default class HttpRequestFactory extends DisposableBase {
    private _http;
    protected _uriDefaults: Uri;
    constructor(_http: IHttpRequestAdapter, uriDefaults?: string | IUri);
    protected _onDispose(): void;
    uri(uri: string | IUri): HttpRequestFactory;
    params(params: QueryParam.Convertible): HttpRequestFactory;
    request<TResult>(method: HttpMethodValue, data?: any): IPromise<TResult>;
    get<TResult>(): IPromise<TResult>;
    put<TResult>(): IPromise<TResult>;
    post<TResult>(data: any): IPromise<TResult>;
    'delete'<TResult>(): IPromise<TResult>;
}
