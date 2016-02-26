/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.net.webrequest%28v=vs.110%29.aspx
 */

///<reference path="../Promises/IPromise.d.ts"/>
///<reference path="../Uri/IUri.d.ts"/>
///<reference path="../Uri/IUriComponentFormattable.d.ts"/>
///<reference path="Http/HttpMethodValue.d.ts"/>
///<reference path="Http/IHttpRequestParams.d.ts"/>

/*
 * The purpose of the following interfaces is facilitate using a third party WebRequest class by wrapping it in another class with the following methods exposed.
 * Some classes which consume WebRequests may only need a get method for example.
 */

interface IHttpGetRequest {

}

interface IAdaptHttpRequest
{
	request<TResult>(params:IHttpRequestParams):IPromise<TResult>;
}

interface IAdaptHttpGet
{
	get<TResult>(
		uri:string|IUri,
		queryParams?:string|IUriComponentMap|UriComponentArray):IPromise<TResult>;
}

interface IAdaptHttpPost
{
	post<TData,TResult>(params:IHttpPostParams<TData>):IPromise<TResult>;
}


interface IAdaptHttpGetAndPost extends IAdaptHttpGet, IAdaptHttpPost
{

}

interface IAdaptHttpDelete
{
	'delete'<TResult>(
		uri:string|IUri,
		queryParams?:string|IUriComponentMap|UriComponentArray):IPromise<TResult>;
}



interface IAdaptHttpBasic extends IAdaptHttpGet, IAdaptHttpPost, IAdaptHttpDelete
{

}
