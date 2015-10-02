/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/// <reference path="IValidationResult.d.ts"/>

const valid = new ValidationResult(true);

class ValidationResult implements IValidationResult
{
	constructor(
		public isValid:boolean = false,
		public message:string = null,
		public data:any = null)
	{

		// Readonly...
		Object.freeze(this);
	}

	static get valid():IValidationResult {
		return valid;
	}

	static invalid(
		message:string,
		data:any = null):IValidationResult
	{
		return new ValidationResult(false, message, data);
	}
}


export = ValidationResult
