/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implementations.
 * Uses .add(T) and .take():T
 */
import { DisposableBase } from "./DisposableBase";
export declare class ObjectPool<T> extends DisposableBase {
    private _maxSize;
    private _generator?;
    private _recycler?;
    private _pool;
    private _trimmer;
    private _flusher;
    private _autoFlusher;
    /**
     * A transient amount of object to exist over _maxSize until trim() is called.
     * But any added objects over _localAbsMaxSize will be disposed immediately.
     */
    private _localAbsMaxSize;
    /**
     * By default will clear after 5 seconds of non-use.
     */
    autoClearTimeout: number;
    constructor(_maxSize: number, _generator?: ((...args: any[]) => T) | undefined, _recycler?: ((o: T) => void) | undefined);
    /**
     * Defines the maximum at which trimming should allow.
     * @returns {number}
     */
    readonly maxSize: number;
    /**
     * Current number of objects in pool.
     * @returns {number}
     */
    readonly count: number;
    protected _trim(): void;
    /**
     * Will trim ensure the pool is less than the maxSize.
     * @param defer A delay before trimming.  Will be overridden by later calls.
     */
    trim(defer?: number): void;
    protected _clear(): void;
    /**
     * Will clear out the pool.
     * Cancels any scheduled trims when executed.
     * @param defer A delay before clearing.  Will be overridden by later calls.
     */
    clear(defer?: number): void;
    toArrayAndClear(): T[];
    /**
     * Shortcut for toArrayAndClear();
     */
    dump(): T[];
    protected _onDispose(): void;
    extendAutoClear(): void;
    add(o: T): void;
    private _onTaken;
    tryTake(): T | undefined;
    take(factory?: () => T): T;
}
export default ObjectPool;
