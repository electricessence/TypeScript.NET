/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */
import IUri from "../../Uri/IUri";
import HttpMethod from "./HttpMethod";
export interface IHttpRequestParamsBase {
    /**
     * See HttpMethod.ts and HttpMethodValue.d.ts.  HttpMethodValue is a string literal type.
     */
    method?: HttpMethod;
    uri: string | IUri;
    data?: any;
}
export interface IHttpRequestParams extends IHttpRequestParamsBase {
    method: HttpMethod;
}
export interface IHttpMethodParams<TMethod extends HttpMethod> extends IHttpRequestParamsBase {
    method?: TMethod;
}
export interface IHttpPostParams<TData> extends IHttpMethodParams<HttpMethod.POST> {
    data: TData;
}
export default IHttpRequestParams;
