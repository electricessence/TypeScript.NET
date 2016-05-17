/// <reference path="../../../../source/System/Tasks/ICancellable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export default function defer(task: Closure, delay?: number): ICancellable;
export declare function interval(task: Function, interval: number, count?: number): ICancellable;
