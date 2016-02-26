/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.net.webrequest%28v=vs.110%29.aspx
 */

///<reference path="Security/AuthenticationLevel.d.ts"/>
///<reference path="Cache/IRequestCachePolicy.d.ts"/>

interface IWebRequest {

	authenticationLevel:AuthenticationLevel;
	cachePolicy:IRequestCachePolicy;
	connectionGroupName:string;

	contentLength:number;
	contentType:string;
}