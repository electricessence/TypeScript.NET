/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

interface IGeneratorResult<T> {
	value:T;
	done:boolean;
}

interface IReadOnlyGenerator<T>
{
	next():IGeneratorResult<T>;
}

interface IGenerator<T> extends IReadOnlyGenerator<T> {
	next(value?:T):IGeneratorResult<T>;
	'return'(value:T):IGeneratorResult<T>;
	'throw'(exception:any):IGeneratorResult<T>;
}