/*
* @author electricessence / https://github.com/electricessence/
* Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System.Collections
{
	// Is interchangable with Array, but also allows for other similar constructs.
	export interface IArray<T>
	{
		length: number;
		[index: number]: T;
	}

} 