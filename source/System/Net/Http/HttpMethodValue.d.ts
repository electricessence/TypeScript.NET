/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */

declare type HttpOptionsMethod = 'OPTIONS';
declare type HttpHeadMethod = 'HEAD';
declare type HttpGetMethod = 'GET';
declare type HttpPutMethod = 'PUT';
declare type HttpPostMethod = 'POST';
declare type HttpDeleteMethod = 'DELETE';
declare type HttpTraceMethod = 'TRACE';
declare type HttpConnectMethod = 'CONNECT';

/**
 * The allowed HTTP Method values.
 */
declare type HttpMethodValue
	= HttpOptionsMethod
	| HttpHeadMethod
	| HttpGetMethod
	| HttpPutMethod
	| HttpPostMethod
	| HttpDeleteMethod
	| HttpTraceMethod
	| HttpConnectMethod;
