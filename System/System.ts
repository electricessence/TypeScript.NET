///<reference path="Functions.ts"/>
///<reference path="Types.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System {

	import Types = System.Types;

	// #region Function Signatures.
	export interface Action<T>
	{
		(object: T, index?: number): void;
	}

	export interface Predicate<T>
	{
		(object: T, index?:number): boolean;
	}

	export interface Comparison<T>
	{
		(a: T, b :T): number;
	}

	export interface Func<TResult>
	{
		(): TResult;
	}

	export interface Selector<TSource, TResult>
	{
		(source: TSource, index?:number): TResult;
	}
	// #endregion


	export function isEqualToNaN(n: any): boolean {
		return typeof n === Types.Number && isNaN(n);
	}

	// Used for special equals cases like NaN.
	export function areEqual(a: any, b: any, strict: boolean = true): boolean {
		return a === b || !strict && a == b || isEqualToNaN(a) && isEqualToNaN(b);
	}

	export function compare(a: any, b: any, strict: boolean = true): number
	{

		if (areEqual(a, b, strict))
			return 0 | 0;

		if (a > b)
			return (+1) | 0;

		if (b > a)
			return (-1) | 0;

		return NaN;
	}


	export function clone(source: any, depth: number = 0): any {
		if (depth < 0)
			return source;

		switch (typeof source) {
			case Types.Undefined:
			case Types.Null:
			case Types.String:
			case Types.Boolean:
			case Types.Number:
			case Types.Function:
				return source;// return primitives as is.
		}

		var result: any;
		if (source instanceof Array) {
			result = (<any>source).slice();
			if (depth > 0) {
				for (var i = 0; i < result.length; i++)
					if (i in result)
						result[i] = clone(result[i], depth - 1);
			}
		} else {
			result = {};
			if (depth > 0) for (var k in source) { // noinspection JSUnfilteredForInLoop
				result[k] = clone(source[k], depth - 1);
			}
		}
 
		return result;

	}

	export function copyTo(source: any, target: any): void {
		for (var k in source) { // noinspection JSUnfilteredForInLoop
			target[k] = source[k];
		}
	}

	export function applyMixins(derivedCtor: any, baseCtors: any[]):void {
		baseCtors.forEach(
			baseCtor => {
				Object.getOwnPropertyNames(baseCtor.prototype).forEach(
					name => {
						derivedCtor.prototype[name] = baseCtor.prototype[name]; } );
			}
		);
	}
}

