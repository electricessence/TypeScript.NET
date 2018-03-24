/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ArgumentOutOfRangeException, { Error } from "./ArgumentOutOfRangeException";
import Primitive from "../Primitive";
export { Error };
export default class ArgumentLessThanMinimumException<T extends Primitive> extends ArgumentOutOfRangeException {
    readonly minValue: T;
    constructor(paramName: string, minValue: T, actualValue: T, message?: string, innerException?: Error);
    protected getName(): string;
}
