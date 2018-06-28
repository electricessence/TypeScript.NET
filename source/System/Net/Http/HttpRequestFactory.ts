/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {QueryParam} from "../../Uri/QueryParam";
import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {DisposableBase} from "../../Disposable/DisposableBase";
import {HttpMethodValue} from "./HttpMethodValue";
import {HttpMethod} from "./HttpMethod";
import {Uri} from "../../Uri/Uri";
import {IUri} from "../../Uri/IUri";
import {IHttpRequestAdapter} from "./IHttpRequestAdapter";
import __extendsImport from "../../../extends";
import GET = HttpMethod.GET;
import PUT = HttpMethod.PUT;
import POST = HttpMethod.POST;
import DELETE = HttpMethod.DELETE;
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;
const NAME = 'HttpRequestFactory';
/**
 * This class exposes a factory for making requests to prepared uri and params.
 */
export class HttpRequestFactory extends DisposableBase
{

	protected _uriDefaults:Uri;

	constructor(
		private _http:IHttpRequestAdapter,
		uriDefaults?:string|IUri)
	{
		super(NAME);

		if(!_http)
			throw new ArgumentNullException('_http');

		this._uriDefaults = Uri.from(uriDefaults);
	}

	protected _onDispose()
	{
		// super._onDispose(); // Not required for first level inheritance.
		this._http = <any>null;
		this._uriDefaults = <any>null;
	}

	uri(uri:string|IUri):HttpRequestFactory
	{

		const _ = this;
		_.throwIfDisposed();
		const d = _._uriDefaults,
		      u = Uri.from(uri, d);

		return d && u.equals(d)
			? _
			: new HttpRequestFactory(_._http, u);
	}

	params(params:QueryParam.Convertible):HttpRequestFactory
	{
		const _ = this;
		_.throwIfDisposed();
		return _.uri(_._uriDefaults.updateQuery(params));
	}

	request<TResult>(method:HttpMethodValue.Any, data?:any):PromiseLike<TResult>
	{
		const _ = this;
		_.throwIfDisposed();
		return _._http.request({
			method: method,
			uri: <any>_._uriDefaults,
			data: data
		});
	}


	get<TResult>():PromiseLike<TResult>
	{
		return this.request<TResult>(HttpMethod.GET);
	}

	put<TResult>():PromiseLike<TResult>
	{
		return this.request<TResult>(HttpMethod.PUT);
	}

	post<TResult>(data:any):PromiseLike<TResult>
	{
		return this.request<TResult>(HttpMethod.POST, data);
	}

	'delete'<TResult>():PromiseLike<TResult>
	{
		return this.request<TResult>(HttpMethod.DELETE);
	}

}

export default HttpRequestFactory;