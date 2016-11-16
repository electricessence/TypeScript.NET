import { Closure } from "../FunctionTypes";
import { ICancellable } from "./ICancellable";
export declare function deferImmediate(task: Closure, context?: any): ICancellable;
export declare function deferImmediate(task: Function, context?: any, args?: any[]): ICancellable;
export declare function runAfterDeferred(task: Closure): void;
export default deferImmediate;
