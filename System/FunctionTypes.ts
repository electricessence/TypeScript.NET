/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


interface Action<T>
{
	(object: T, index?: number): void;
}

interface Predicate<T>
{
	(object: T, index?:number): boolean;
}

interface Comparison<T>
{
	(a: T, b :T): number;
}

interface Func<TResult>
{
	(): TResult;
}

interface Selector<TSource, TResult>
{
	(source: TSource, index?:number): TResult;
}