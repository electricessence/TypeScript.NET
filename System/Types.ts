///<reference path="Functions.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System
{

	"use strict";

	export class Types
	{
		// Calling an instance of this class allows for a local/private non-interferable copy.

		Boolean: string = typeof true;
		Number: string = typeof 0;
		String: string = typeof "";
		Object: string = typeof {};
		Null: string = typeof null;
		Undefined: string = typeof undefined;
		Function: string = typeof Functions.Blank;

		static get Boolean(): string { return typeof true; }
		static get Number(): string { return typeof 0; }
		static get String(): string { return typeof ""; }
		static get Object(): string { return typeof {}; }
		static get Null(): string { return typeof null; }
		static get Undefined(): string { return typeof undefined; }
		static get Function(): string { return typeof Functions.Blank; }


		isBoolean(type: any): boolean
		{
			return typeof type === this.Boolean;
		}

		static isBoolean(type: any): boolean
		{
			return typeof type === Types.Boolean;
		}

		isNumber(type: any): boolean
		{
			return typeof type === this.Number;
		}

		static isNumber(type: any): boolean
		{
			return typeof type === Types.Number;
		}


		isString(type: any): boolean
		{
			return typeof type === this.String;
		}

		static isString(type: any): boolean
		{
			return typeof type === Types.String;
		}


		isFunction(type: any): boolean
		{
			return typeof type === this.Function;
		}

		static isFunction(type: any): boolean
		{
			return typeof type === Types.Function;
		}



	}
}