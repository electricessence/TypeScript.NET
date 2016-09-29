/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import * as QueryParam from "../../Uri/QueryParam";
import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {DisposableBase} from "../../Disposable/DisposableBase";
import {HttpMethodValue} from "./HttpMethodValue";
import {GET, PUT, POST, DELETE} from "./HttpMethod";
import {Uri} from "../../Uri/Uri";
import {IUri} from "../../Uri/IUri";
import {IHttpRequestAdapter} from "./IHttpRequestAdapter";
import __extendsImport from "../../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

/**
 * This class exposes a factory for making requests to prepared uri and params.
 */
export default class HttpRequestFactory extends DisposableBase
{

	protected _uriDefaults:Uri;

	constructor(
		private _http:IHttpRequestAdapter,
		uriDefaults?:string|IUri)
	{
		super();

		this._disposableObjectName = 'HttpRequestFactory';

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
		var d = _._uriDefaults,
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

	request<TResult>(method:HttpMethodValue, data?:any):PromiseLike<TResult>
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
		return this.request<TResult>(GET);
	}

	put<TResult>():PromiseLike<TResult>
	{
		return this.request<TResult>(PUT);
	}

	post<TResult>(data:any):PromiseLike<TResult>
	{
		return this.request<TResult>(POST, data);
	}

	'delete'<TResult>():PromiseLike<TResult>
	{
		return this.request<TResult>(DELETE);
	}

}
