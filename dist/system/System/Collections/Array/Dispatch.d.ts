/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IArray } from "./IArray";
import { Selector } from "../../FunctionTypes";
export interface DispatchErrorHandler {
    (ex: any, index: number): void;
}
export declare function unsafe<T>(listeners: IArray<Selector<T, any>>, payload: T, trap?: boolean | DispatchErrorHandler): void;
export declare function mapped<T, TResult>(listeners: IArray<Selector<T, TResult>>, payload: T, trap?: boolean | DispatchErrorHandler): TResult[];
export declare function dispatch<T>(listeners: IArray<Selector<T, any>>, payload: T, trap?: boolean | DispatchErrorHandler): void;
export default dispatch;
