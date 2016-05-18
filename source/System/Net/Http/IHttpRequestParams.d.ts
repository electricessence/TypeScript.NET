/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */


import * as HttpMethod from "./HttpMethodValue";
import {HttpMethodValue} from "./HttpMethodValue";
import {IUri} from "../../Uri/IUri";

interface IHttpRequestParamsBase
{
	/**
	 * See HttpMethod.ts and HttpMethodValue.d.ts.  HttpMethodValue is a string literal type.
	 */
	method?:HttpMethodValue;
	uri:string|IUri;
	data?:any;
}

export interface IHttpRequestParams extends IHttpRequestParamsBase
{
	method:HttpMethodValue;
}

export interface IHttpMethodParams<TMethod extends HttpMethodValue> extends IHttpRequestParamsBase
{
	method?:TMethod;
}

export interface IHttpPostParams<TData> extends IHttpMethodParams<HttpMethod.Post>
{
	data:TData;
}

export default IHttpRequestParams;