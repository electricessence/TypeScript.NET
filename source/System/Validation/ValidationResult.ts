/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/// <reference path="IValidationResult.d.ts"/>

const valid = new ValidationResult(true);

class ValidationResult implements IValidationResult
{
	isValid:boolean;
	message:string;
	data:any;

	constructor(
		isValid:boolean = false,
		message:string = null,
		data:any = null)
	{
		this.isValid = isValid;
		this.message = message;
		this.data = data;

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
