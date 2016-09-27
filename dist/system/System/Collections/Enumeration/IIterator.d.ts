/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/*
 * Included for ES6 compatibility.
 */

export interface IIteratorResult<T>
{
	done:boolean;
	value?:T;
	index?:number;
}

export interface IIterator<T>
{
	next(value?:any):IIteratorResult<T>;
	'return'?<TReturn>(value?:TReturn):IIteratorResult<TReturn>;
	'throw'?(e?:any):IIteratorResult<T>;
}

export default IIterator;