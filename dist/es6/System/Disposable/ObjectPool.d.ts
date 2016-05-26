/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implementations.
 * Uses .add(T) and .take():T
 */
import { DisposableBase } from "./DisposableBase";
export declare class ObjectPool<T> extends DisposableBase {
    private _maxSize;
    private _generator;
    private _recycler;
    private _pool;
    private _trimmer;
    private _flusher;
    private _autoFlusher;
    private _localAbsMaxSize;
    autoClearTimeout: number;
    constructor(_maxSize: number, _generator: (...args: any[]) => T, _recycler?: (o: T) => void);
    maxSize: number;
    count: number;
    protected _trim(): void;
    trim(defer?: number): void;
    protected _clear(): void;
    clear(defer?: number): void;
    toArrayAndClear(): T[];
    dump(): T[];
    protected _onDispose(): void;
    extendAutoClear(): void;
    add(o: T): void;
    take(): T;
}
export default ObjectPool;
