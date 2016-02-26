/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */

///<reference path="HttpMethodValue.d.ts"/>
///<reference path="../../Uri/IUri.d.ts"/>


interface IHttpRequestParamsBase {
	/**
	 * See HttpMethod.ts and HttpMethodValue.d.ts.  HttpMethodValue is a string literal type.
	 */
	method?:HttpMethodValue;
	uri:string|IUri;
	data?:any;
}

interface IHttpRequestParams extends IHttpRequestParamsBase {
	method:HttpMethodValue;
}

interface IHttpMethodParams<TMethod extends HttpMethodValue> extends IHttpRequestParamsBase {
	method?:TMethod;
}

interface IHttpPostParams<TData> extends IHttpMethodParams<HttpPostMethod> {
	data:TData;
}