import { IEquatable } from "../IEquatable";
import { IValidationResult } from "./IValidationResult";
export default class ValidationResult implements IValidationResult, IEquatable<IValidationResult> {
    readonly isValid: boolean;
    readonly message: string;
    readonly data: any;
    constructor(isValid?: boolean, message?: string, data?: any);
    equals(other: IValidationResult): boolean;
    static readonly valid: IValidationResult;
    static invalid(message: string, data?: any): IValidationResult;
}
