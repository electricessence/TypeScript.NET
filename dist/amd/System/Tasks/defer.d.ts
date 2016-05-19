/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ICancellable } from "./ICancellable";
import { Closure } from "../FunctionTypes";
export default function defer(task: Closure, delay?: number): ICancellable;
export declare function interval(task: Function, interval: number, count?: number): ICancellable;
