/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export interface IValidationResult
{
	isValid:boolean;
	message?:string;
	data:any;
}

export default IValidationResult;