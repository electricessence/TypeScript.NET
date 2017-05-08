/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ICancellable } from "./ICancellable";
import { Closure, Func } from "../FunctionTypes";
export declare function defer(task: Closure, delay?: number): ICancellable;
export declare function defer<T>(task: Func<T>, delay?: number, payload?: T): ICancellable;
export declare function interval(task: Function, interval: number, count?: number): ICancellable;
export default defer;
