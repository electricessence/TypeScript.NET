/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
import { Promise, PromiseBase, ArrayPromise, PromiseCollection } from "../../Promises/Promise";
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
    static maxConcurrency(max: number): Parallel;
    protected _getWorkerSource(task: Function | string, env?: any): string;
    require(...required: RequireType[]): this;
    requireThese(required: RequireType[]): this;
    protected _spawnWorker(task: Function | string, env?: any): WorkerLike;
    startNew<T, U>(data: T, task: (data: T) => U, env?: any): Promise<U>;
    pipe<T, U>(data: T[], task: (data: T) => U, env?: any): PromiseCollection<U>;
    private ensureClampedMaxConcurrency();
    map<T, U>(data: T[], task: (data: T) => U, env?: any): ArrayPromise<U>;
    static isSupported: boolean;
    static options(options?: ParallelOptions): Parallel;
    static require(...required: RequireType[]): Parallel;
    static requireThese(required: RequireType[]): Parallel;
    static startNew<T, U>(data: T, task: (data: T) => U, env?: any): PromiseBase<U>;
    static map<T, U>(data: T[], task: (data: T) => U, env?: any): ArrayPromise<U>;
}
export default Parallel;
