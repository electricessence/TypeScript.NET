/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IHttpRequestAdapter.d.ts"/>
///<reference path="HttpMethodValue.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import Uri from "../../Uri/Uri";
import DisposableBase from "../../Disposable/DisposableBase";
import QueryBuilder from "../../Uri/QueryBuilder";
import {GET, PUT, POST, DELETE} from "./HttpMethod";

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

	protected _onDispose() {
		// super._onDispose(); // Not required for first level inheritance.
		this._http = null;
		this._uriDefaults = null;
	}

	uri(uri:string|IUri):HttpRequestFactory
	{

		var _ = this;
		_.throwIfDisposed();
		var u = Uri.from(uri, _._uriDefaults);
		return _._uriDefaults.equals(u)
			? _
			: new HttpRequestFactory(_._http, u);
	}

	params(params:QueryParamsConvertible):HttpRequestFactory
	{
		var _ = this;
		_.throwIfDisposed();
		return _.uri(_._uriDefaults.updateQuery(params));
	}

	request<TResult>(method:HttpMethodValue, data?:any):IPromise<TResult>
	{
		var _ = this;
		_.throwIfDisposed();
		return _._http.request({
			method: method,
			uri: _._uriDefaults,
			data: data
		});
	}


	get<TResult>():IPromise<TResult>
	{
		return this.request<TResult>(GET);
	}

	put<TResult>():IPromise<TResult>
	{
		return this.request<TResult>(PUT);
	}

	post<TResult>(data:any):IPromise<TResult>
	{
		return this.request<TResult>(POST, data);
	}

	'delete'<TResult>():IPromise<TResult>
	{
		return this.request<TResult>(DELETE);
	}

}
