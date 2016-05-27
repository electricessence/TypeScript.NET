/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {Primitive} from "./Primitive";
import {IArray} from "./Collections/Array/IArray"; // For compatibility with (let, const, function, class);

const
	VOID0:any         = void(0),
	_BOOLEAN:string   = typeof true,
	_NUMBER:string    = typeof 0,
	_STRING:string    = typeof "",
	_OBJECT:string    = typeof {},
	_UNDEFINED:string = typeof VOID0,
	_FUNCTION:string  = typeof function() {},
	LENGTH:string     = "length";

// Only used for primitives.
var typeInfoRegistry:{[key:string]:TypeInfo} = {};

/**
 * Exposes easy access to type information including inquiring about members.
 */
export class TypeInfo
{
	// Not retained for primitives. Since they have no members.
	protected target:any;

	type:string;

	isBoolean:boolean;
	isNumber:boolean;
	isFinite:boolean;
	isValidNumber:boolean;
	isString:boolean;
	isTrueNaN:boolean;
	isObject:boolean;
	isArray:boolean;
	isFunction:boolean;
	isUndefined:boolean;
	isNull:boolean;
	isNullOrUndefined:boolean;
	isPrimitive:boolean;

	constructor(target:any,onBeforeFreeze?:()=>void)
	{
		var _ = this;
		_.isBoolean = false;
		_.isNumber = false;
		_.isString = false;
		_.isTrueNaN = false;
		_.isObject = false;
		_.isFunction = false;
		_.isUndefined = false;
		_.isNull = false;
		_.isPrimitive = false;

		switch(_.type = typeof target)
		{
			case _BOOLEAN:
				_.isBoolean = true;
				_.isPrimitive = true;
				break;
			case _NUMBER:
				_.isNumber = true;
				_.isTrueNaN = isNaN(target);
				_.isFinite = isFinite(target);
				_.isValidNumber = !_.isTrueNaN;
				_.isPrimitive = true;
				break;
			case _STRING:
				_.isString = true;
				_.isPrimitive = true;
				break;
			case _OBJECT:
				_.target = target;
				if(target===null)
				{
					_.isNull = true;
					_.isNullOrUndefined = true;
					_.isPrimitive = true;
				}
				else
				{
					_.isArray = Array.isArray(target);
					_.isObject = true;
				}
				break;
			case _FUNCTION:
				_.target = target;
				_.isFunction = true;
				break;
			case _UNDEFINED:
				_.isUndefined = true;
				_.isNullOrUndefined = true;
				_.isPrimitive = true;
				break;
			default:
				throw "Fatal type failure.  Unknown type: " + _.type;
		}

		if(onBeforeFreeze) onBeforeFreeze();
		Object.freeze(_);

	}

	/**
	 * Returns a TypeInfo for any member or non-member,
	 * where non-members are of type undefined.
	 * @param name
	 * @returns {TypeInfo}
	 */
	member(name:string):TypeInfo
	{
		var t = this.target;
		return TypeInfo.getFor(
			t && (name) in (t)
				? t[name]
				: undefined);
	}

	/**
	 * Returns a TypeInfo for any target object.
	 * If the target object is of a primitive type, it returns the TypeInfo instance assigned to that type.
	 * @param target
	 * @returns {TypeInfo}
	 */
	static getFor(target:any):TypeInfo
	{
		var type:string = typeof target;
		switch(type)
		{
			case _OBJECT:
			case _FUNCTION:
				return new TypeInfo(target);
		}
		var info = typeInfoRegistry[type];
		if(!info) typeInfoRegistry[type] = info = new TypeInfo(target);
		return info;
	}
	
	

}

export module Type
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
	export function isBoolean(value:any):value is boolean
	{
		return typeof value===_BOOLEAN;
	}

	/**
	 * Returns true if the value parameter is a number.
	 * @param value
	 * @param allowNaN Default is true.
	 * @returns {boolean}
	 */
	export function isNumber(value:any, allowNaN?:boolean):value is number
	{
		if(allowNaN===VOID0) allowNaN = true;
		return typeof value===_NUMBER && (allowNaN || !isNaN(value));
	}

	/**
	 * Returns true if is a number and is NaN.
	 * @param value
	 * @returns {boolean}
	 */
	export function isTrueNaN(value:any):value is number
	{
		return typeof value===_NUMBER && isNaN(value);
	}

	/**
	 * Returns true if the value parameter is a string.
	 * @param value
	 * @returns {boolean}
	 */
	export function isString(value:any):value is string
	{
		return typeof value===_STRING;
	}

	/**
	 * Returns true if the value is a boolean, string, number, null, or undefined.
	 * @param value
	 * @returns {boolean}
	 */
	export function isPrimitive(value:any):value is Primitive
	{
		var t = typeof value;
		switch(t)
		{
			case _BOOLEAN:
			case _STRING:
			case _NUMBER:
			case _UNDEFINED:
				return true;
			case _OBJECT:
				return value===null;

		}
		return false;
	}

	/**
	 * Returns true if the value parameter is a function.
	 * @param value
	 * @returns {boolean}
	 */
	export function isFunction(value:any):value is Function
	{
		return typeof value===_FUNCTION;
	}

	/**
	 * Returns true if the value parameter is an object.
	 * @param value
	 * @param allowNull If false (default) null is not considered an object.
	 * @returns {boolean}
	 */
	export function isObject(value:any, allowNull:boolean = false):boolean
	{
		return typeof value===_OBJECT && (allowNull || value!==null);
	}

	/**
	 * Guarantees a number value or NaN instead.
	 * @param value
	 * @returns {number}
	 */
	export function numberOrNaN(value:any):number
	{
		return isNaN(value) ? NaN : value;
	}

	export function of(target:any):TypeInfo
	{
		return TypeInfo.getFor(target);
	}

	export function hasMember(value:any, property:string):boolean
	{
		return value && !isPrimitive(value) && (property) in (value);
	}

	export function hasMemberOfType<T>(instance:any, property:string, type:string):instance is T
	{
		return hasMember(instance, property) && typeof(instance[property])===type;
	}

	export function isArrayLike<T>(instance:any):instance is IArray<T>
	{
		/*
		 * NOTE:
		 *
		 * Functions:
		 * Enumerating a function although it has a .length property will yield nothing or unexpected results.
		 * Effectively, a function is not like an array.
		 *
		 * Strings:
		 * Behave like arrays but don't have the same exact methods.
		 */
		return instance instanceof Array
			|| Type.isString(instance)
			|| !Type.isFunction(instance) && hasMember(instance, LENGTH);
	}
}

Object.freeze(Type);

export default Type;

