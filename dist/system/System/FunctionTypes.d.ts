/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export interface Selector<TSource, TResult>
{
	(source:TSource, index?:number):TResult;
}

export interface SelectorIndexed<TSource, TResult>
{
	(source:TSource, index:number):TResult;
}

export interface Action<T> extends Selector<T, void>
{
}

export interface Predicate<T> extends Selector<T, boolean>
{
}

export interface ActionIndexed<T> extends SelectorIndexed<T, void>
{
}

export interface PredicateIndexed<T> extends SelectorIndexed<T, boolean>
{
}


export interface Comparison<T>
{
	(a:T, b:T, strict?:boolean):number;
}

export interface EqualityComparison<T>
{
	(a:T, b:T, strict?:boolean):boolean;
}


export interface Func<TResult>
{
	():TResult;
}

export interface Closure
{
	():void;
}
