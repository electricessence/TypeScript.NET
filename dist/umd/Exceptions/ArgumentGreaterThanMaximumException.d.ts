/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ArgumentOutOfRangeException, { Error } from "./ArgumentOutOfRangeException";
import Primitive from "../Primitive";
export { Error };
export default class ArgumentGreaterThanMaximumException<T extends Primitive> extends ArgumentOutOfRangeException {
    readonly maxValue: T;
    constructor(paramName: string, maxValue: T, actualValue: T, message?: string, innerException?: Error);
    protected getName(): string;
}
