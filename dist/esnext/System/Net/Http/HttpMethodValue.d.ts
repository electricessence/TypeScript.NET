/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */
export declare module HttpMethodValue {
    type Options = 'OPTIONS';
    type Head = 'HEAD';
    type Get = 'GET';
    type Put = 'PUT';
    type Post = 'POST';
    type Delete = 'DELETE';
    type Trace = 'TRACE';
    type Connect = 'CONNECT';
    /**
     * The allowed HTTP Method values.
     */
    type Any = Options | Head | Get | Put | Post | Delete | Trace | Connect;
}
export default HttpMethodValue;
