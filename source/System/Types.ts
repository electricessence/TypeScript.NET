/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

const
_BOOLEAN:string   = typeof true,
_NUMBER:string    = typeof 0,
_STRING:string    = typeof "",
_OBJECT:string    = typeof {},
_NULL:string      = typeof null,
_UNDEFINED:string = typeof undefined,
_FUNCTION:string  = typeof function(){};


export module Types
{
	/**
	 * typeof true
	 * @type {string}
	 */
	export const BOOLEAN:string = _BOOLEAN;

	/**
	 * typeof 0
	 * @type {string}
	 */
	export const NUMBER:string = _NUMBER;

	/**
	 * typeof ""
	 * @type {string}
	 */
	export const STRING:string = _STRING;

	/**
	 * typeof {}
	 * @type {string}
	 */
	export const OBJECT:string = _OBJECT;

	/**
	 * typeof null
	 * @type {string}
	 */
	export const NULL:string = _NULL;

	/**
	 * typeof undefined
	 * @type {string}
	 */
	export const UNDEFINED:string = _UNDEFINED;

	/**
	 * typeof function
	 * @type {string}
	 */
	export const FUNCTION:string = _FUNCTION;

	/**
	 * Returns true if the value parameter is a boolean.
	 * @param value
	 * @returns {boolean}
	 */
	export function isBoolean(value:any):boolean
	{
		return typeof value===_BOOLEAN;
	}

	/**
	 * Returns true if the value parameter is a number.
	 * @param value
	 * @param allowNaN
	 * @returns {boolean}
	 */
	export function isNumber(value:any, allowNaN:boolean = true):boolean
	{
		return typeof value===_NUMBER && (allowNaN || !isNaN(value));
	}

	/**
	 * Returns true if is a number and is NaN.
	 * @param value
	 * @returns {boolean}
	 */
	export function isTrueNaN(value:any):boolean
	{
		return typeof value===_NUMBER && isNaN(value);
	}

	/**
	 * Returns true if the value parameter is a string.
	 * @param value
	 * @returns {boolean}
	 */
	export function isString(value:any):boolean
	{
		return typeof value===_STRING;
	}

	/**
	 * Returns true if the value parameter is a function.
	 * @param value
	 * @returns {boolean}
	 */
	export function isFunction(value:any):boolean
	{
		return typeof value===_FUNCTION;
	}

	/**
	 * Returns true if the value parameter is an object.
	 * @param value
	 * @returns {boolean}
	 */
	export function isObject(value:any):boolean
	{
		return typeof value===_OBJECT;
	}
}

Object.freeze(Types);

export default Types;
