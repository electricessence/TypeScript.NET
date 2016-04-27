/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/*
 * Included for ES6 compatibility.
 */

interface IIteratorResult<T> {
	done: boolean;
	value?: T;
}

interface IIterator<T> {
	next(value?: any): IIteratorResult<T>;
	'return'?(value?: any): IIteratorResult<T>;
	'throw'?(e?: any): IIteratorResult<T>;
}