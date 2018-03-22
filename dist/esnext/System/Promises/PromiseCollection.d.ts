/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { DisposableBase } from "../Disposable/DisposableBase";
import { ArrayPromise } from "./ArrayPromise";
import PromiseBase from "./PromiseBase";
/**
 * A Promise collection exposes useful methods for handling a collection of promises and their results.
 */
export declare class PromiseCollection<T> extends DisposableBase {
    private _source;
    constructor(source: PromiseLike<T>[] | null | undefined);
    protected _onDispose(): void;
    /**
     * Returns a copy of the source promises.
     * @returns {PromiseLike<PromiseLike<any>>[]}
     */
    readonly promises: PromiseLike<T>[];
    /**
     * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
     * @returns {PromiseBase<any>}
     */
    all(): ArrayPromise<T>;
    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @returns {PromiseBase<any>} A new Promise.
     */
    race(): PromiseBase<T>;
    /**
     * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
     * Unlike .all this method waits for all rejections as well as fulfillment.
     * @returns {PromiseBase<PromiseLike<any>[]>}
     */
    waitAll(): ArrayPromise<PromiseLike<T>>;
    /**
     * Waits for all the values to resolve and then applies a transform.
     * @param transform
     * @returns {PromiseBase<Array<any>>}
     */
    map<U>(transform: (value: T) => U): ArrayPromise<U>;
    /**
     * Applies a transform to each promise and defers the result.
     * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
     * @param transform
     * @returns {PromiseCollection<U>}
     */
    pipe<U>(transform: (value: T) => U | PromiseLike<U>): PromiseCollection<U>;
    reduce(reduction: (previousValue: T, currentValue: T, i?: number, array?: PromiseLike<T>[]) => T, initialValue?: T | PromiseLike<T>): PromiseBase<T>;
    reduce<U>(reduction: (previousValue: U, currentValue: T, i?: number, array?: PromiseLike<T>[]) => U, initialValue: U | PromiseLike<U>): PromiseBase<U>;
}
