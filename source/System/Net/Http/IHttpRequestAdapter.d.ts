/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../Promises/IPromise.d.ts"/>
///<reference path="IHttpRequestParams.d.ts"/>

/**
 * Facilitates injecting a http request class for use with other classes.
 */
interface IHttpRequestAdapter
{
	request<TResult>(params:IHttpRequestParams):IPromise<TResult>;
}
