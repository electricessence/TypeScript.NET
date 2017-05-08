/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */
import { HttpMethodValue } from "./HttpMethodValue";
export declare module HttpMethod {
    const OPTIONS: HttpMethodValue.Options, HEAD: HttpMethodValue.Head, GET: HttpMethodValue.Get, PUT: HttpMethodValue.Put, POST: HttpMethodValue.Post, DELETE: HttpMethodValue.Delete, TRACE: HttpMethodValue.Trace, CONNECT: HttpMethodValue.Connect;
}
