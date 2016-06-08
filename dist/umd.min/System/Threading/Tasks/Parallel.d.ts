/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
import { PromiseBase } from "../../Promises/Promise";
import { WorkerLike } from "../WorkerType";
export interface ParallelOptions {
    evalPath?: string;
    maxConcurrency?: number;
    allowSynchronous?: boolean;
    env?: any;
    envNamespace?: string;
}
export declare type RequireType = string | Function | {
    name?: string;
    fn: Function;
};
export declare class Parallel {
    options: ParallelOptions;
    _requiredScripts: string[];
    _requiredFunctions: {
        name?: string;
        fn: Function;
    }[];
    constructor(options?: ParallelOptions);
    getWorkerSource(task: Function, env?: any): string;
    require(...required: RequireType[]): Parallel;
    requireThese(required: RequireType[]): Parallel;
    protected _spawnWorker(task: Function, env?: any): WorkerLike;
    startNew<T, U>(data: T, task: (data: T) => U, env?: any): PromiseBase<U>;
    static isSupported: boolean;
    static options(options?: ParallelOptions): Parallel;
    static require(...required: RequireType[]): Parallel;
    static requireThese(required: RequireType[]): Parallel;
    static startNew<T, U>(data: T, task: (data: T) => U, env?: any): PromiseBase<U>;
    forEach<T>(data: T[], task: (data: T) => void, env?: any): PromiseBase<void>;
}
export default Parallel;
