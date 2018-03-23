/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/*
 * Included for ES6 compatibility.
 */

export default interface IIteratorResult<T>
{
	done:boolean;
	value?:T;
	index?:number;
}