export namespace TypeOf
{
	export const BOOLEAN = 'boolean';
	export const NUMBER = 'number';
	export const STRING = 'string';
	export const SYMBOL = 'symbol';
	export const OBJECT = 'object';
	export const UNDEFINED = 'undefined';
	export const FUNCTION = 'function';
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