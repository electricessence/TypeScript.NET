export namespace TypeOf
{
	export const BOOLEAN:'boolean' = 'boolean';
	export const NUMBER:'number' = 'number';
	export const STRING:'string' = 'string';
	export const SYMBOL:'symbol' = 'symbol';
	export const OBJECT:'object' = 'object';
	export const UNDEFINED:'undefined' = 'undefined';
	export const FUNCTION:'function' = 'function';
}

export type TypeOfValue =
	'boolean'
	| 'number'
	| 'string'
	| 'symbol'
	| 'object'
	| 'undefined'
	| 'function';

export default TypeOf;