/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IEquatable} from "../IEquatable";
import {IValidationResult} from "./IValidationResult"; // For compatibility with (let, const, function, class);

const valid = new ValidationResult(true);

/**
 * A class for generating responses to validation.
 */
export default
class ValidationResult
implements IValidationResult, IEquatable<IValidationResult>
{
	/**
	 * Allows for rare cases that ValidationResult.valid and ValidationResult.invalid() don't cover.
	 */
	constructor(
		public isValid:boolean = false,
		public message:string = null,
		public data:any = null)
	{

		// Readonly...
		Object.freeze(this);
	}

	/**
	 * Allows for comparing another IValidationResult to see if they are equal.
	 */
	equals(other:IValidationResult):boolean
	{
		var _ = this;
		return _.isValid===other.isValid
			&& _.message==_.message
			&& _.data==_.data;
	}


	/**
	 * Represents a single/shared instance of a valid result.
	 * Allows for returning this instance like you would return 'true'.
	 */
	static get valid():IValidationResult {
		return valid;
	}

	/**
	 * Factory method for easily creating an invalid result.
	 */
	static invalid(
		message:string,
		data:any = null):IValidationResult
	{
		return new ValidationResult(false, message, data);
	}
}
