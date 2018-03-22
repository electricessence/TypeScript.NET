/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export default interface IValidationResult
{
	isValid:boolean;
	message?:string;
	data:any;
}
