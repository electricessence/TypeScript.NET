/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Primitive from "./Primitive";
import TypeValue from "./TypeValue";
import ArrayLikeWritable from "./Collections/Array/ArrayLikeWritable";

const
	VOID0      = <undefined>void(0),
	_BOOLEAN   = <TypeValue.Boolean>typeof true,
	_NUMBER    = <TypeValue.Number>typeof 0,
	_STRING    = <TypeValue.String>typeof "",
	_SYMBOL    = <TypeValue.Symbol>"symbol",
	_OBJECT    = <TypeValue.Object>typeof {},
	_UNDEFINED = <TypeValue.Undefined>typeof VOID0,
	_FUNCTION  = <TypeValue.Function>typeof function() {},
	LENGTH     = <string>"length";

// Only used for primitives.
const typeInfoRegistry:{[key:string]:TypeInfo} = {};

/**
 * Exposes easy access to type information including inquiring about members.
 */
export class TypeInfo
{
	// Not retained for primitives. Since they have no members.
	protected readonly target:any;

	readonly type:string;

	readonly isBoolean:boolean;
	readonly isNumber:boolean;
	readonly isFinite:boolean;
	readonly isValidNumber:boolean;
	readonly isString:boolean;
	readonly isTrueNaN:boolean;
	readonly isObject:boolean;
	readonly isArray:boolean;
	readonly isFunction:boolean;
	readonly isUndefined:boolean;
	readonly isNull:boolean;
	readonly isNullOrUndefined:boolean;
	readonly isPrimitive:boolean;
	readonly isSymbol:boolean;

	constructor(target:any, onBeforeFreeze?:(instance:any)=>void)
	{
		this.isBoolean = false;
		this.isNumber = false;
		this.isFinite = false;
		this.isValidNumber = false;
		this.isString = false;
		this.isTrueNaN = false;
		this.isObject = false;
		this.isFunction = false;
		this.isUndefined = false;
		this.isNull = false;
		this.isPrimitive = false;
		this.isSymbol = false;
		this.isArray = false;
		this.isNullOrUndefined = false;

		switch(this.type = typeof target)
		{
			case _BOOLEAN:
				this.isBoolean = true;
				this.isPrimitive = true;
				break;
			case _NUMBER:
				this.isNumber = true;
				this.isTrueNaN = isNaN(target);
				this.isFinite = isFinite(target);
				this.isValidNumber = !this.isTrueNaN;
				this.isPrimitive = true;
				break;
			case _STRING:
				this.isString = true;
				this.isPrimitive = true;
				break;
			case _SYMBOL:
				this.isSymbol = true;
				break;
			case _OBJECT:
				this.target = target;
				if(target===null)
				{
					this.isNull = true;
					this.isNullOrUndefined = true;
					this.isPrimitive = true;
				}
				else
				{
					this.isArray = (target) instanceof (Array);
					this.isObject = true;
				}
				break;
			case _FUNCTION:
				this.target = target;
				this.isFunction = true;
				break;
			case _UNDEFINED:
				this.isUndefined = true;
				this.isNullOrUndefined = true;
				this.isPrimitive = true;
				break;
			default:
				throw "Fatal type failure.  Unknown type: " + this.type;
		}

		if(onBeforeFreeze) onBeforeFreeze(this);
		Object.freeze(this);

	}

	/**
	 * Returns a TypeInfo for any member or non-member,
	 * where non-members are of type undefined.
	 * @param name
	 * @returns {TypeInfo}
	 */
	member(name:string|number|symbol):TypeInfo
	{
		const t = this.target;
		return TypeInfo.getFor(
			t && (name) in (t)
				? t[name]
				: VOID0);
	}

	/**
	 * Returns a TypeInfo for any target object.
	 * If the target object is of a primitive type, it returns the TypeInfo instance assigned to that type.
	 * @param target
	 * @returns {TypeInfo}
	 */
	static getFor(target:any):TypeInfo
	{
		const type:string = typeof target;
		switch(type)
		{
			case _OBJECT:
			case _FUNCTION:
				return new TypeInfo(target);
		}
		let info = typeInfoRegistry[type];
		if(!info) typeInfoRegistry[type] = info = new TypeInfo(target);
		return info;
	}

	/**
	 * Returns true if the target matches the type (instanceof).
	 * @param type
	 * @returns {boolean}
	 */
	is<T>(type:{new (...params:any[]):T}):boolean
	{
		return this.target instanceof type;
	}

	/**
	 * Returns null if the target does not match the type (instanceof).
	 * Otherwise returns the target as the type.
	 * @param type
	 * @returns {T|null}
	 */
	as<T>(type:{new (...params:any[]):T}):T|null
	{
		return this.target instanceof type ? this.target : null
	}

}

export function Type(target:any):TypeInfo
{
	return new TypeInfo(target);
}

export module Type
{
	/**
	 * typeof true
	 * @type {string}
	 */
	export const BOOLEAN:TypeValue.Boolean = _BOOLEAN;

	/**
	 * typeof 0
	 * @type {string}
	 */
	export const NUMBER:TypeValue.Number = _NUMBER;

	/**
	 * typeof ""
	 * @type {string}
	 */
	export const STRING:TypeValue.String = _STRING;

	/**
	 * typeof {}
	 * @type {string}
	 */
	export const OBJECT:TypeValue.Object = _OBJECT;


	/**
	 * typeof Symbol
	 * @type {string}
	 */
	export const SYMBOL:TypeValue.Symbol = _SYMBOL;

	/**
	 * typeof undefined
	 * @type {string}
	 */
	export const UNDEFINED:TypeValue.Undefined = _UNDEFINED;

	/**
	 * typeof function
	 * @type {string}
	 */
	export const FUNCTION:TypeValue.Function = _FUNCTION;

	/**
	 * Returns true if the target matches the type (instanceof).
	 * @param target
	 * @param type
	 * @returns {T|null}
	 */
	export function is<T>(target:Object, type:{new (...params:any[]):T}):target is T
	{
		return target instanceof type;
	}

	/**
	 * Returns null if the target does not match the type (instanceof).
	 * Otherwise returns the target as the type.
	 * @param target
	 * @param type
	 * @returns {T|null}
	 */
	export function as<T>(target:Object, type:{new (...params:any[]):T}):T|null
	{
		return target instanceof type ? target : null;
	}

	/**
	 * Returns true if the value parameter is null or undefined.
	 * @param value
	 * @returns {boolean}
	 */
	export function isNullOrUndefined(value:any):value is null|undefined
	{
		return value==null;
	}

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
	 * @param ignoreNaN Default is false. When true, NaN is not considered a number and will return false.
	 * @returns {boolean}
	 */
	export function isNumber(value:any, ignoreNaN:boolean = false):value is number
	{
		return typeof value===_NUMBER && (!ignoreNaN || !isNaN(value));
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
	 * @param allowUndefined if set to true will return true if the value is undefined.
	 * @returns {boolean}
	 */
	export function isPrimitive(value:any, allowUndefined:boolean = false):value is Primitive
	{
		const t = typeof value;
		switch(t)
		{
			case _BOOLEAN:
			case _STRING:
			case _NUMBER:
				return true;
			case _UNDEFINED:
				return allowUndefined;
			case _OBJECT:
				return value===null;

		}
		return false;
	}

	/**
	 * For detecting if the value can be used as a key.
	 * @param value
	 * @param allowUndefined
	 * @returns {boolean|boolean}
	 */
	export function isPrimitiveOrSymbol(
		value:any,
		allowUndefined:boolean = false):value is Primitive|symbol
	{
		return typeof value===_SYMBOL ? true : isPrimitive(value, allowUndefined);
	}

	/**
	 * Returns true if the value is a string, number, or symbol.
	 * @param value
	 * @returns {boolean}
	 */
	export function isPropertyKey(value:any):value is string|number|symbol
	{
		const t = typeof value;
		switch(t)
		{
			case _STRING:
			case _NUMBER:
			case _SYMBOL:
				return true;
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

	/**
	 * Returns a TypeInfo object for the target.
	 * @param target
	 * @returns {TypeInfo}
	 */
	export function of(target:any):TypeInfo
	{
		return TypeInfo.getFor(target);
	}

	/**
	 * Will detect if a member exists (using 'in').
	 * Returns true if a property or method exists on the object or its prototype.
	 * @param instance
	 * @param property Name of the member.
	 * @param ignoreUndefined When ignoreUndefined is true, if the member exists but is undefined, it will return false.
	 * @returns {boolean}
	 */
	export function hasMember(instance:any, property:string, ignoreUndefined:boolean = true):boolean
	{
		return instance && !isPrimitive(instance) && (property) in (instance) && (ignoreUndefined || instance[property]!==VOID0);
	}

	/**
	 * Returns true if the member matches the type.
	 * @param instance
	 * @param property
	 * @param type
	 * @returns {boolean}
	 */
	export function hasMemberOfType<T>(
		instance:any, property:string,
		type:TypeValue):instance is T
	{
		return hasMember(instance, property) && typeof(instance[property])===type;
	}

	export function hasMethod<T>(instance:any, property:string):instance is T
	{
		return hasMemberOfType<T>(instance, property, _FUNCTION);
	}

	export function isArrayLike<T>(instance:any):instance is ArrayLikeWritable<T>
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

