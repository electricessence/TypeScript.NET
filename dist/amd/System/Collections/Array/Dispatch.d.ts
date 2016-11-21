import { IArray } from "./IArray";
import { Selector } from "../../FunctionTypes";
export interface DispatchErrorHandler {
    (ex: any, index: number): void;
}
/**
 * Simply takes a payload and passes it to all the listeners.
 *
 * While dispatching:
 * * This is an unsafe method if by chance any of the listeners modify the array.
 * * It cannot prevent changes to the payload.
 *
 * Improving safety:
 * * Only use a local array that isn't exposed to the listeners.
 * * Use the dispatch method instead as it makes a copy of the listeners array.
 * * Freeze the listeners array so it can't be modified.
 * * Freeze the payload.
 *
 * Specifying trap will catch any errors and pass them along if trap is a function.
 * A payload is used instead of arguments for easy typing.
 *
 *
 * @param listeners
 * @param payload
 * @param trap
 */
export declare function unsafe<T>(listeners: IArray<Selector<T, any>>, payload: T, trap?: boolean | DispatchErrorHandler): void;
/**
 * Simply takes a payload and passes it to all the listeners.
 * Returns the results in an array that matches the indexes of the listeners.
 *
 * @param listeners
 * @param payload
 * @param trap
 * @returns {any}
 */
export declare function mapped<T, TResult>(listeners: IArray<Selector<T, TResult>>, payload: T, trap?: boolean | DispatchErrorHandler): TResult[];
/**
 * Simply takes a payload and passes it to all the listeners.
 * Makes a copy of the listeners before calling dispatchUnsafe.
 *
 * @param listeners
 * @param payload
 * @param trap
 */
export declare function dispatch<T>(listeners: IArray<Selector<T, any>>, payload: T, trap?: boolean | DispatchErrorHandler): void;
export default dispatch;
