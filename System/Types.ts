///<reference path="Functions.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System
{

	"use strict";

	export module Types
	{
		// Calling an instance of this class allows for a local/private 'sealed' copy.

		export var Boolean: string = typeof true;
		export var Number: string = typeof 0;
		export var String: string = typeof "";
		export var Object: string = typeof {};
		export var Null: string = typeof null;
		export var Undefined: string = typeof undefined;
		export var Function: string = typeof Functions.Blank;

		export function isBoolean(type: any): boolean
		{
			return typeof type === Types.Boolean;
		}

		export function isNumber(type: any): boolean
		{
			return typeof type === Types.Number;
		}

		export function isString(type: any): boolean
		{
			return typeof type === Types.String;
		}

		export function isFunction(type: any): boolean
		{
			return typeof type === Types.Function;
		}

		export function isSimpleType(type: any): boolean
		{
			switch (typeof type)
			{
				case Boolean:
				case Number:
				case String:
				case Null:
				case Undefined:
					return true;
				default:
					return false;
			}
		}

	}

	// Sealed class/module.
	Object.freeze(System.Types);

}