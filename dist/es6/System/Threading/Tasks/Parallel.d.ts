/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
import { ArrayPromise, TSDNPromise, PromiseBase, PromiseCollection } from "../../Promises/Promise";
import { WorkerLike } from "../WorkerType";
export interface ParallelOptions {
    /**
     * This is the path to the file eval.js.  This is required when running in node, and required for some browsers (IE 10) in order to work around cross-domain restrictions for web workers.  Defaults to the same location as parallel.js in node environments, and null in the browser.
     **/
    evalPath?: string;
    /**
     * The maximum number of permitted worker threads.  This will default to 4, or the number of CPUs on your computer if you're running node.
     **/
    maxConcurrency?: number;
    /**
     * If WebWorkers are not available, whether or not to fall back to synchronous processing using setTimeout.  Defaults to true.
     **/
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
    protected _spawnWorker(task: Function | string, env?: any): WorkerLike | undefined;
    /**
     * Schedules the task to be run in the worker pool.
     * @param data
     * @param task
     * @param env
     * @returns {TSDNPromise<U>|TSDNPromise}
     */
    startNew<T, U>(data: T, task: (data: T) => U, env?: any): TSDNPromise<U>;
    /**
     * Runs the task within the local thread/process.
     * Is good for use with testing.
     * @param data
     * @param task
     * @returns {TSDNPromise<U>|TSDNPromise}
     */
    startLocal<T, U>(data: T, task: (data: T) => U): TSDNPromise<U>;
    /**
     * Returns an array of promises that each resolve after their task completes.
     * Provides a potential performance benefit by not waiting for all promises to resolve before proceeding to next step.
     * @param data
     * @param task
     * @param env
     * @returns {PromiseCollection}
     */
    pipe<T, U>(data: T[], task: (data: T) => U, env?: any): PromiseCollection<U>;
    private ensureClampedMaxConcurrency();
    /**
     * Waits for all tasks to resolve and returns a promise with the results.
     * @param data
     * @param task
     * @param env
     * @returns {ArrayPromise}
     */
    map<T, U>(data: T[], task: (data: T) => U, env?: any): ArrayPromise<U>;
    static readonly isSupported: boolean;
    static options(options?: ParallelOptions): Parallel;
    static require(...required: RequireType[]): Parallel;
    static requireThese(required: RequireType[]): Parallel;
    static startNew<T, U>(data: T, task: (data: T) => U, env?: any): PromiseBase<U>;
    static map<T, U>(data: T[], task: (data: T) => U, env?: any): ArrayPromise<U>;
}
export default Parallel;
