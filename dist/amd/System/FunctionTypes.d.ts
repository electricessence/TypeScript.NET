/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export interface Action<T>
{
	(object:T, index?:number): void;
}

export interface Predicate<T>
{
	(object:T, index?:number): boolean;
}

export interface Comparison<T>
{
	(a:T, b:T, strict?:boolean): number;
}

export interface EqualityComparison<T>
{
	(a:T, b:T, strict?:boolean): boolean;
}


export interface Func<TResult>
{
	(): TResult;
}

export interface Closure {
	():void;
}

export interface Selector<TSource, TResult>
{
	(source:TSource, index?:number): TResult;
}
