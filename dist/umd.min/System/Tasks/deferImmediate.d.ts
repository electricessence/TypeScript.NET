/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
import { Closure } from "../FunctionTypes";
import { ICancellable } from "./ICancellable";
export default function deferImmediate(task: Closure): ICancellable;
export declare function runAfterDeferred(task: Closure): void;
