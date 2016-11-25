/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */

export module HttpMethodValue {

	export type Options = 'OPTIONS';
	export type Head = 'HEAD';
	export type Get = 'GET';
	export type Put = 'PUT';
	export type Post = 'POST';
	export type Delete = 'DELETE';
	export type Trace = 'TRACE';
	export type Connect = 'CONNECT';


	/**
	 * The allowed HTTP Method values.
	 */
	export type Any
		= Options
		| Head
		| Get
		| Put
		| Post
		| Delete
		| Trace
		| Connect;
}


export default HttpMethodValue;