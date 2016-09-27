/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.net.webrequest%28v=vs.110%29.aspx
 */


import {IRequestCachePolicy} from "./Cache/IRequestCachePolicy";
import {AuthenticationLevel} from "./Security/AuthenticationLevel";

export interface IWebRequest
{

	authenticationLevel:AuthenticationLevel;
	cachePolicy:IRequestCachePolicy;
	connectionGroupName:string;

	contentLength:number;
	contentType:string;
}

export default IWebRequest;