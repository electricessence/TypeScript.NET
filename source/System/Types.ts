/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

'use strict';

import Functions = require('./Functions');

/**
 * Sealed/Frozen module for simple type comparison.
 */
module Types
{

	// Calling an instance of this class allows for a local/private 'sealed' shallowCopy.

	/**
	 * typeof true
	 * @type {string}
	 */
	export var Boolean:string = typeof true;

	/**
	 * typeof 0
	 * @type {string}
	 */
	export var Number:string = typeof 0;

	/**
	 * typeof ""
	 * @type {string}
	 */
	export var String:string = typeof "";

	/**
	 * typeof {}
	 * @type {string}
	 */
	export var Object:string = typeof {};

	/**
	 * typeof null
	 * @type {string}
	 */
	export var Null:string = typeof null;

	/**
	 * typeof undefined
	 * @type {string}
	 */
	export var Undefined:string = typeof undefined;

	/**
	 * typeof function
	 * @type {string}
	 */
	export var Function:string = typeof Functions.Blank;

	/**
	 * Returns true if the value parameter is a boolean.
	 * @param value
	 * @returns {boolean}
	 */
	export function isBoolean(value:any):boolean
	{
		return typeof value===Types.Boolean;
	}

	/**
	 * Returns true if the value parameter is a number.
	 * @param value
	 * @returns {boolean}
	 */
	export function isNumber(value:any):boolean
	{
		return typeof value===Types.Number;
	}

	/**
	 * Returns true if is a number and is NaN.
	 * @param value
	 * @returns {boolean}
	 */
	export function isTrueNaN(value:any):boolean
	{
		return typeof value===Types.Number && isNaN(value);
	}

	/**
	 * Returns true if the value parameter is a string.
	 * @param value
	 * @returns {boolean}
	 */
	export function isString(value:any):boolean
	{
		return typeof value===Types.String;
	}

	/**
	 * Returns true if the value parameter is a function.
	 * @param value
	 * @returns {boolean}
	 */
	export function isFunction(value:any):boolean
	{
		return typeof value===Types.Function;
	}

}

// Sealed class/module.
Object.freeze(Types);


export = Types;
