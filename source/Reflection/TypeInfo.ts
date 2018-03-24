/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import TypeOf from "./TypeOf";

const VOID0 = <undefined>void(0);

// Only used for primitives.
const typeInfoRegistry:{ [key:string]:TypeInfo } = {};

/**
 * Exposes easy access to type information including inquiring about members.
 */
export default class TypeInfo
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

	constructor(target:any, onBeforeFreeze?:(instance:any) => void)
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
			case TypeOf.Boolean:
				this.isBoolean = true;
				this.isPrimitive = true;
				break;
			case TypeOf.Number:
				this.isNumber = true;
				this.isTrueNaN = isNaN(target);
				this.isFinite = isFinite(target);
				this.isValidNumber = !this.isTrueNaN;
				this.isPrimitive = true;
				break;
			case TypeOf.String:
				this.isString = true;
				this.isPrimitive = true;
				break;
			case TypeOf.Symbol:
				this.isSymbol = true;
				break;
			case TypeOf.Object:
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
			case TypeOf.Function:
				this.target = target;
				this.isFunction = true;
				break;
			case TypeOf.Undefined:
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
	member(name:string | number | symbol):TypeInfo
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
			case TypeOf.Object:
			case TypeOf.Function:
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
	is<T>(type:{ new (...params:any[]):T }):boolean
	{
		return this.target instanceof type;
	}

	/**
	 * Returns null if the target does not match the type (instanceof).
	 * Otherwise returns the target as the type.
	 * @param type
	 * @returns {T|null}
	 */
	as<T>(type:{ new (...params:any[]):T }):T | null
	{
		return this.target instanceof type ? this.target : null
	}

}
