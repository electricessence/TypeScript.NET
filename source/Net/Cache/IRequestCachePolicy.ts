/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.net.cache.RequestCachePolicy%28v=vs.110%29.aspx
 */


import {RequestCacheLevel} from "./RequestCacheLevel";

export interface IRequestCachePolicy
{
	/**
	 * Gets the RequestCacheLevel value specified when this instance was constructed.
	 */
	level:RequestCacheLevel;
}

export default IRequestCachePolicy;