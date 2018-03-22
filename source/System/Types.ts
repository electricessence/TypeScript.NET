/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Primitive from "./Primitive";
import TypeOfValue from "./TypeOfValue";
import ArrayLikeWritable from "./Collections/Array/ArrayLikeWritable";
import TypeInfo from "./TypeInfo";

const VOID0 = <undefined>void(0);

function Type(target:any):TypeInfo
{
	return new TypeInfo(target);
}

module Type
{
	/**
	 * Returns true if the target matches the type (instanceof).
	 * @param target
	 * @param type
	 * @returns {T|null}
	 */
	export function is<T>(target:Object, type:{ new (...params:any[]):T }):target is T
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
	export function as<T>(target:Object, type:{ new (...params:any[]):T }):T | null
	{
		return target instanceof type ? target : null;
	}

	/**
	 * Returns true if the value parameter is null or undefined.
	 * @param value
	 * @returns {boolean}
	 */
	export function isNullOrUndefined(value:any):value is null | undefined
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
		return typeof value===TypeOfValue.Boolean;
	}

	/**
	 * Returns true if the value parameter is a number.
	 * @param value
	 * @param ignoreNaN Default is false. When true, NaN is not considered a number and will return false.
	 * @returns {boolean}
	 */
	export function isNumber(value:any, ignoreNaN:boolean = false):value is number
	{
		return typeof value===TypeOfValue.Number && (!ignoreNaN || !isNaN(value));
	}

	/**
	 * Returns true if is a number and is NaN.
	 * @param value
	 * @returns {boolean}
	 */
	export function isTrueNaN(value:any):value is number
	{
		return typeof value===TypeOfValue.Number && isNaN(value);
	}

	/**
	 * Returns true if the value parameter is a string.
	 * @param value
	 * @returns {boolean}
	 */
	export function isString(value:any):value is string
	{
		return typeof value===TypeOfValue.String;
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
			case TypeOfValue.Boolean:
			case TypeOfValue.String:
			case TypeOfValue.Number:
				return true;
			case TypeOfValue.Undefined:
				return allowUndefined;
			case TypeOfValue.Object:
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
		allowUndefined:boolean = false):value is Primitive | symbol
	{
		return typeof value===TypeOfValue.Symbol ? true : isPrimitive(value, allowUndefined);
	}

	/**
	 * Returns true if the value is a string, number, or symbol.
	 * @param value
	 * @returns {boolean}
	 */
	export function isPropertyKey(value:any):value is string | number | symbol
	{
		const t = typeof value;
		switch(t)
		{
			case TypeOfValue.String:
			case TypeOfValue.Number:
			case TypeOfValue.Symbol:
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
		return typeof value===TypeOfValue.Function;
	}

	/**
	 * Returns true if the value parameter is an object.
	 * @param value
	 * @param allowNull If false (default) null is not considered an object.
	 * @returns {boolean}
	 */
	export function isObject(value:any, allowNull:boolean = false):boolean
	{
		return typeof value===TypeOfValue.Object && (allowNull || value!==null);
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
		type:TypeOfValue):instance is T
	{
		return hasMember(instance, property) && typeof(instance[property])===type;
	}

	export function hasMethod<T>(instance:any, property:string):instance is T
	{
		return hasMemberOfType<T>(instance, property, TypeOfValue.Function);
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
			|| !Type.isFunction(instance) && hasMember(instance, "length");
	}
}

Object.freeze(Type);

export default Type;

