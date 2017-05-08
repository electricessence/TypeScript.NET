/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Selector } from "../../FunctionTypes";
export interface DispatchErrorHandler {
    (ex: any, index: number): void;
}
/**
 * Simply takes a payload and passes it to all the listeners.
 * Makes a arrayCopy of the listeners before calling dispatchUnsafe.
 *
 * @param listeners
 * @param payload
 * @param trap
 */
export declare function dispatch<T>(listeners: ArrayLike<Selector<T, any>>, payload: T, trap?: boolean | DispatchErrorHandler): void;
export declare module dispatch {
    /**
     * Simply takes a payload and passes it to all the listeners.
     *
     * While dispatching:
     * * This is an unsafe method if by chance any of the listeners modify the array.
     * * It cannot prevent changes to the payload.
     *
     * Improving safety:
     * * Only use a local array that isn't exposed to the listeners.
     * * Use the dispatch method instead as it makes a arrayCopy of the listeners array.
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
    function unsafe<T>(listeners: ArrayLike<Selector<T, any>>, payload: T, trap?: boolean | DispatchErrorHandler): void;
    /**
     * Simply takes a payload and passes it to all the listeners.
     * Returns the results in an array that matches the indexes of the listeners.
     *
     * @param listeners
     * @param payload
     * @param trap
     * @returns {any}
     */
    function mapped<T, TResult>(listeners: ArrayLike<Selector<T, TResult>>, payload: T, trap?: boolean | DispatchErrorHandler): TResult[];
}
export default dispatch;
