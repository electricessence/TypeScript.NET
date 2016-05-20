/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IHttpRequestParams} from "./IHttpRequestParams";
/**
 * Facilitates injecting a http request class for use with other classes.
 */
export interface IHttpRequestAdapter
{
	request<TResult>(params:IHttpRequestParams):PromiseLike<TResult>;
}

export default IHttpRequestAdapter;
