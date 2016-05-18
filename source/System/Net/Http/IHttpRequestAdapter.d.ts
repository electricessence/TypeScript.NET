/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IPromise} from "../../Promises/IPromise";
import {IHttpRequestParams} from "./IHttpRequestParams";
/**
 * Facilitates injecting a http request class for use with other classes.
 */
export interface IHttpRequestAdapter
{
	request<TResult>(params:IHttpRequestParams):IPromise<TResult>;
}

export default IHttpRequestAdapter;
