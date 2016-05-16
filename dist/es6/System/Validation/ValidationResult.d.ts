/// <reference path="../../../../source/System/Validation/IValidationResult.d.ts" />
/// <reference path="../../../../source/System/IEquatable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export default class ValidationResult implements IValidationResult, IEquatable<IValidationResult> {
    isValid: boolean;
    message: string;
    data: any;
    constructor(isValid?: boolean, message?: string, data?: any);
    equals(other: IValidationResult): boolean;
    static valid: IValidationResult;
    static invalid(message: string, data?: any): IValidationResult;
}
