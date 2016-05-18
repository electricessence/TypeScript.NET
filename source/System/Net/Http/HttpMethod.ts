/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */


import * as HttpMethod from "./HttpMethodValue";

export const
	OPTIONS:HttpMethod.Options = 'OPTIONS',
	HEAD:HttpMethod.Head       = 'HEAD',
	GET:HttpMethod.Get         = 'GET',
	PUT:HttpMethod.Put         = 'PUT',
	POST:HttpMethod.Post       = 'POST',
	DELETE:HttpMethod.Delete   = 'DELETE',
	TRACE:HttpMethod.Trace     = 'TRACE',
	CONNECT:HttpMethod.Connect = 'CONNECT';
