import { ArgumentException, Error } from "./ArgumentException";
import { Primitive } from "../Primitive";
export { Error };
export declare class ArgumentOutOfRangeException extends ArgumentException {
    actualValue: Primitive | null | undefined;
    constructor(paramName: string, actualValue: Primitive | null | undefined, message?: string, innerException?: Error);
    protected getName(): string;
}
export default ArgumentOutOfRangeException;
