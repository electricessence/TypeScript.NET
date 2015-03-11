/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Collections {

	export interface IEqualityComparer<T>
	{
		equals(x:T,y:T):boolean;
		//getHashCode():number; // int
	}

} 