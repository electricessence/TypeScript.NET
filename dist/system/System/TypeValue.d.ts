export module TypeValue
{
	export type Boolean = 'boolean';
	export type Number = 'number';
	export type String = 'string';
	export type Symbol = 'symbol';
	export type Object = 'object';
	export type Undefined = 'undefined';
	export type Function = 'function';

	export type Primitive = String | Number | Boolean;

	export type Any = Primitive
		| Symbol
		| Undefined
		| Function;
}