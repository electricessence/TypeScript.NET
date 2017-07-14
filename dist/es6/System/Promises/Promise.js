/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
/*
 * Resources:
 * https://promisesaplus.com/
 * https://github.com/kriskowal/q
 */
import Type from "../Types";
import { deferImmediate } from "../Threading/deferImmediate";
import { DisposableBase } from "../Disposable/DisposableBase";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ObjectPool } from "../Disposable/ObjectPool";
import { Set } from "../Collections/Set";
import { defer } from "../Threading/defer";
import { ObjectDisposedException } from "../Disposable/ObjectDisposedException";
//noinspection JSUnusedLocalSymbols
const VOID0 = void 0, NULL = null, PROMISE = "Promise", PROMISE_STATE = PROMISE + "State", THEN = "then", TARGET = "target";
function isPromise(value) {
    return Type.hasMemberOfType(value, THEN, Type.FUNCTION);
}
function resolve(value, resolver, promiseFactory) {
    let nextValue = resolver
        ? resolver(value)
        : value;
    return nextValue && isPromise(nextValue)
        ? TSDNPromise.wrap(nextValue)
        : promiseFactory(nextValue);
}
function handleResolution(p, value, resolver) {
    try {
        let v = resolver ? resolver(value) : value;
        if (p) {
            p.resolve(v);
        }
        return null;
    }
    catch (ex) {
        if (p) {
            p.reject(ex);
        }
        return ex;
    }
}
function handleResolutionMethods(targetFulfill, targetReject, value, resolver) {
    try {
        let v = resolver ? resolver(value) : value;
        if (targetFulfill)
            targetFulfill(v);
    }
    catch (ex) {
        if (targetReject)
            targetReject(ex);
    }
}
function handleDispatch(p, onFulfilled, onRejected) {
    if (p instanceof PromiseBase) {
        p.doneNow(onFulfilled, onRejected);
    }
    else {
        p.then(onFulfilled, onRejected);
    }
}
function handleSyncIfPossible(p, onFulfilled, onRejected) {
    if (p instanceof PromiseBase)
        return p.thenSynchronous(onFulfilled, onRejected);
    else
        return p.then(onFulfilled, onRejected);
}
function newODE() {
    return new ObjectDisposedException("TSDNPromise", "An underlying promise-result was disposed.");
}
export class PromiseState extends DisposableBase {
    constructor(_state, _result, _error) {
        super();
        this._state = _state;
        this._result = _result;
        this._error = _error;
        this._disposableObjectName = PROMISE_STATE;
    }
    _onDispose() {
        this._state = VOID0;
        this._result = VOID0;
        this._error = VOID0;
    }
    getState() {
        return this._state;
    }
    get state() {
        return this._state;
    }
    get isPending() {
        return this.getState() === TSDNPromise.State.Pending;
    }
    get isSettled() {
        return this.getState() != TSDNPromise.State.Pending; // Will also include undefined==0 aka disposed!=resolved.
    }
    get isFulfilled() {
        return this.getState() === TSDNPromise.State.Fulfilled;
    }
    get isRejected() {
        return this.getState() === TSDNPromise.State.Rejected;
    }
    /*
     * Providing overrides allows for special defer or lazy sub classes.
     */
    getResult() {
        return this._result;
    }
    get result() {
        this.throwIfDisposed();
        return this.getResult();
    }
    getError() {
        return this._error;
    }
    get error() {
        this.throwIfDisposed();
        return this.getError();
    }
}
export class PromiseBase extends PromiseState {
    constructor() {
        super(TSDNPromise.State.Pending);
        this._disposableObjectName = PROMISE;
    }
    thenThis(onFulfilled, onRejected) {
        this.doneNow(onFulfilled, onRejected);
        return this;
    }
    /**
     * Standard .then method that defers execution until resolved.
     * @param onFulfilled
     * @param onRejected
     * @returns {TSDNPromise}
     */
    then(onFulfilled, onRejected) {
        this.throwIfDisposed();
        return new TSDNPromise((resolve, reject) => {
            this.doneNow(result => handleResolutionMethods(resolve, reject, result, onFulfilled), error => onRejected
                ? handleResolutionMethods(resolve, reject, error, onRejected)
                : reject(error));
        });
    }
    /**
     * Same as .then but doesn't trap errors.  Exceptions may end up being fatal.
     * @param onFulfilled
     * @param onRejected
     * @returns {TSDNPromise}
     */
    thenAllowFatal(onFulfilled, onRejected) {
        this.throwIfDisposed();
        return new TSDNPromise((resolve, reject) => {
            this.doneNow(result => resolve((onFulfilled ? onFulfilled(result) : result)), error => reject(onRejected ? onRejected(error) : error));
        });
    }
    /**
     * .done is provided as a non-standard means that maps to similar functionality in other promise libraries.
     * As stated by promisejs.org: 'then' is to 'done' as 'map' is to 'forEach'.
     * @param onFulfilled
     * @param onRejected
     */
    done(onFulfilled, onRejected) {
        defer(() => this.doneNow(onFulfilled, onRejected));
    }
    /**
     * Will yield for a number of milliseconds from the time called before continuing.
     * @param milliseconds
     * @returns A promise that yields to the current execution and executes after a delay.
     */
    delayFromNow(milliseconds = 0) {
        this.throwIfDisposed();
        return new TSDNPromise((resolve, reject) => {
            defer(() => {
                this.doneNow(v => resolve(v), e => reject(e));
            }, milliseconds);
        }, true // Since the resolve/reject is deferred.
        );
    }
    /**
     * Will yield for a number of milliseconds from after this promise resolves.
     * If the promise is already resolved, the delay will start from now.
     * @param milliseconds
     * @returns A promise that yields to the current execution and executes after a delay.
     */
    delayAfterResolve(milliseconds = 0) {
        this.throwIfDisposed();
        if (this.isSettled)
            return this.delayFromNow(milliseconds);
        return new TSDNPromise((resolve, reject) => {
            this.doneNow(v => defer(() => resolve(v), milliseconds), e => defer(() => reject(e), milliseconds));
        }, true // Since the resolve/reject is deferred.
        );
    }
    /**
     * Shortcut for trapping a rejection.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    'catch'(onRejected) {
        return this.then(VOID0, onRejected);
    }
    /**
     * Shortcut for trapping a rejection but will allow exceptions to propagate within the onRejected handler.
     * @param onRejected
     * @returns {PromiseBase<TResult>}
     */
    catchAllowFatal(onRejected) {
        return this.thenAllowFatal(VOID0, onRejected);
    }
    /**
     * Shortcut to for handling either resolve or reject.
     * @param fin
     * @returns {PromiseBase<TResult>}
     */
    'finally'(fin) {
        return this.then(fin, fin);
    }
    /**
     * Shortcut to for handling either resolve or reject but will allow exceptions to propagate within the handler.
     * @param fin
     * @returns {PromiseBase<TResult>}
     */
    finallyAllowFatal(fin) {
        return this.thenAllowFatal(fin, fin);
    }
    /**
     * Shortcut to for handling either resolve or reject.  Returns the current promise instead.
     * You may not need an additional promise result, and this will not create a new one.
     * @param fin
     * @param synchronous
     * @returns {PromiseBase}
     */
    finallyThis(fin, synchronous) {
        const f = synchronous ? fin : () => deferImmediate(fin);
        this.doneNow(f, f);
        return this;
    }
}
export class Resolvable extends PromiseBase {
    doneNow(onFulfilled, onRejected) {
        this.throwIfDisposed();
        switch (this.state) {
            case TSDNPromise.State.Fulfilled:
                if (onFulfilled)
                    onFulfilled(this._result);
                break;
            case TSDNPromise.State.Rejected:
                if (onRejected)
                    onRejected(this._error);
                break;
        }
    }
    thenSynchronous(onFulfilled, onRejected) {
        this.throwIfDisposed();
        try {
            switch (this.state) {
                case TSDNPromise.State.Fulfilled:
                    return onFulfilled
                        ? resolve(this._result, onFulfilled, TSDNPromise.resolve)
                        : this; // Provided for catch cases.
                case TSDNPromise.State.Rejected:
                    return onRejected
                        ? resolve(this._error, onRejected, TSDNPromise.resolve)
                        : this;
            }
        }
        catch (ex) {
            return new Rejected(ex);
        }
        throw new Error("Invalid state for a resolved promise.");
    }
}
/**
 * The simplest usable version of a promise which returns synchronously the resolved state provided.
 */
export class Resolved extends Resolvable {
    constructor(state, result, error) {
        super();
        this._result = result;
        this._error = error;
        this._state = state;
    }
}
/**
 * A fulfilled Resolved<T>.  Provided for readability.
 */
export class Fulfilled extends Resolved {
    constructor(value) {
        super(TSDNPromise.State.Fulfilled, value);
    }
}
/**
 * A rejected Resolved<T>.  Provided for readability.
 */
export class Rejected extends Resolved {
    constructor(error) {
        super(TSDNPromise.State.Rejected, VOID0, error);
    }
}
/**
 * Provided as a means for extending the interface of other PromiseLike<T> objects.
 */
class PromiseWrapper extends Resolvable {
    constructor(_target) {
        super();
        this._target = _target;
        if (!_target)
            throw new ArgumentNullException(TARGET);
        if (!isPromise(_target))
            throw new ArgumentException(TARGET, "Must be a promise-like object.");
        _target.then((v) => {
            this._state = TSDNPromise.State.Fulfilled;
            this._result = v;
            this._error = VOID0;
            this._target = VOID0;
        }, e => {
            this._state = TSDNPromise.State.Rejected;
            this._error = e;
            this._target = VOID0;
        });
    }
    thenSynchronous(onFulfilled, onRejected) {
        this.throwIfDisposed();
        let t = this._target;
        if (!t)
            return super.thenSynchronous(onFulfilled, onRejected);
        return new TSDNPromise((resolve, reject) => {
            handleDispatch(t, result => handleResolutionMethods(resolve, reject, result, onFulfilled), error => onRejected
                ? handleResolutionMethods(resolve, null, error, onRejected)
                : reject(error));
        }, true);
    }
    doneNow(onFulfilled, onRejected) {
        this.throwIfDisposed();
        let t = this._target;
        if (t)
            handleDispatch(t, onFulfilled, onRejected);
        else
            super.doneNow(onFulfilled, onRejected);
    }
    _onDispose() {
        super._onDispose();
        this._target = VOID0;
    }
}
/**
 * This promise class that facilitates pending resolution.
 */
export class TSDNPromise extends Resolvable {
    /*
     * A note about deferring:
     * The caller can set resolveImmediate to true if they intend to initialize code that will end up being deferred itself.
     * This eliminates the extra defer that will occur internally.
     * But for the most part, resolveImmediate = false (the default) will ensure the constructor will not block.
     *
     * resolveUsing allows for the same ability but does not defer by default: allowing the caller to take on the work load.
     * If calling resolve or reject and a deferred response is desired, then use deferImmediate with a closure to do so.
     */
    constructor(resolver, forceSynchronous = false) {
        super();
        if (resolver)
            this.resolveUsing(resolver, forceSynchronous);
    }
    thenSynchronous(onFulfilled, onRejected) {
        this.throwIfDisposed();
        // Already fulfilled?
        if (this._state)
            return super.thenSynchronous(onFulfilled, onRejected);
        const p = new TSDNPromise();
        (this._waiting || (this._waiting = []))
            .push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
        return p;
    }
    doneNow(onFulfilled, onRejected) {
        this.throwIfDisposed();
        // Already fulfilled?
        if (this._state)
            return super.doneNow(onFulfilled, onRejected);
        (this._waiting || (this._waiting = []))
            .push(pools.PromiseCallbacks.init(onFulfilled, onRejected));
    }
    _onDispose() {
        super._onDispose();
        this._resolvedCalled = VOID0;
    }
    resolveUsing(resolver, forceSynchronous = false) {
        if (!resolver)
            throw new ArgumentNullException("resolver");
        if (this._resolvedCalled)
            throw new InvalidOperationException(".resolve() already called.");
        if (this.state)
            throw new InvalidOperationException("Already resolved: " + TSDNPromise.State[this.state]);
        this._resolvedCalled = true;
        let state = 0;
        const rejectHandler = (reason) => {
            if (state) {
                // Someone else's promise handling down stream could double call this. :\
                console.warn(state == -1
                    ? "Rejection called multiple times"
                    : "Rejection called after fulfilled.");
            }
            else {
                state = -1;
                this._resolvedCalled = false;
                this.reject(reason);
            }
        };
        const fulfillHandler = (v) => {
            if (state) {
                // Someone else's promise handling down stream could double call this. :\
                console.warn(state == 1
                    ? "Fulfill called multiple times"
                    : "Fulfill called after rejection.");
            }
            else {
                state = 1;
                this._resolvedCalled = false;
                this.resolve(v);
            }
        };
        // There are some performance edge cases where there caller is not blocking upstream and does not need to defer.
        if (forceSynchronous)
            resolver(fulfillHandler, rejectHandler);
        else
            deferImmediate(() => resolver(fulfillHandler, rejectHandler));
    }
    _emitDisposalRejection(p) {
        const d = p.wasDisposed;
        if (d)
            this._rejectInternal(newODE());
        return d;
    }
    _resolveInternal(result) {
        if (this.wasDisposed)
            return;
        // Note: Avoid recursion if possible.
        // Check ahead of time for resolution and resolve appropriately
        while (result instanceof PromiseBase) {
            let r = result;
            if (this._emitDisposalRejection(r))
                return;
            switch (r.state) {
                case TSDNPromise.State.Pending:
                    r.doneNow(v => this._resolveInternal(v), e => this._rejectInternal(e));
                    return;
                case TSDNPromise.State.Rejected:
                    this._rejectInternal(r.error);
                    return;
                case TSDNPromise.State.Fulfilled:
                    result = r.result;
                    break;
            }
        }
        if (isPromise(result)) {
            result.then(v => this._resolveInternal(v), e => this._rejectInternal(e));
        }
        else {
            this._state = TSDNPromise.State.Fulfilled;
            this._result = result;
            this._error = VOID0;
            const o = this._waiting;
            if (o) {
                this._waiting = VOID0;
                for (let c of o) {
                    let { onFulfilled, promise } = c;
                    pools.PromiseCallbacks.recycle(c);
                    //let ex =
                    handleResolution(promise, result, onFulfilled);
                    //if(!p && ex) console.error("Unhandled exception in onFulfilled:",ex);
                }
                o.length = 0;
            }
        }
    }
    _rejectInternal(error) {
        if (this.wasDisposed)
            return;
        this._state = TSDNPromise.State.Rejected;
        this._error = error;
        const o = this._waiting;
        if (o) {
            this._waiting = null; // null = finished. undefined = hasn't started.
            for (let c of o) {
                let { onRejected, promise } = c;
                pools.PromiseCallbacks.recycle(c);
                if (onRejected) {
                    //let ex =
                    handleResolution(promise, error, onRejected);
                    //if(!p && ex) console.error("Unhandled exception in onRejected:",ex);
                }
                else if (promise) {
                    promise.reject(error);
                }
            }
            o.length = 0;
        }
    }
    resolve(result, throwIfSettled = false) {
        this.throwIfDisposed();
        if (result == this)
            throw new InvalidOperationException("Cannot resolve a promise as itself.");
        if (this._state) {
            // Same value? Ignore...
            if (!throwIfSettled || this._state == TSDNPromise.State.Fulfilled && this._result === result)
                return;
            throw new InvalidOperationException("Changing the fulfilled state/value of a promise is not supported.");
        }
        if (this._resolvedCalled) {
            if (throwIfSettled)
                throw new InvalidOperationException(".resolve() already called.");
            return;
        }
        this._resolveInternal(result);
    }
    reject(error, throwIfSettled = false) {
        this.throwIfDisposed();
        if (this._state) {
            // Same value? Ignore...
            if (!throwIfSettled || this._state == TSDNPromise.State.Rejected && this._error === error)
                return;
            throw new InvalidOperationException("Changing the rejected state/value of a promise is not supported.");
        }
        if (this._resolvedCalled) {
            if (throwIfSettled)
                throw new InvalidOperationException(".resolve() already called.");
            return;
        }
        this._rejectInternal(error);
    }
}
/**
 * By providing an ArrayPromise we expose useful methods/shortcuts for dealing with array results.
 */
export class ArrayPromise extends TSDNPromise {
    /**
     * Simplifies the use of a map function on an array of results when the source is assured to be an array.
     * @param transform
     * @returns {PromiseBase<Array<any>>}
     */
    map(transform) {
        this.throwIfDisposed();
        return new ArrayPromise(resolve => {
            this.doneNow((result) => resolve(result.map(transform)));
        }, true);
    }
    /**
     * Simplifies the use of a reduce function on an array of results when the source is assured to be an array.
     * @param reduction
     * @param initialValue
     * @returns {PromiseBase<any>}
     */
    reduce(reduction, initialValue) {
        return this
            .thenSynchronous((result) => result.reduce(reduction, initialValue));
    }
    static fulfilled(value) {
        return new ArrayPromise(resolve => value, true);
    }
}
const PROMISE_COLLECTION = "PromiseCollection";
/**
 * A Promise collection exposes useful methods for handling a collection of promises and their results.
 */
export class PromiseCollection extends DisposableBase {
    constructor(source) {
        super();
        this._disposableObjectName = PROMISE_COLLECTION;
        this._source = source && source.slice() || [];
    }
    _onDispose() {
        super._onDispose();
        this._source.length = 0;
        this._source = null;
    }
    /**
     * Returns a copy of the source promises.
     * @returns {PromiseLike<PromiseLike<any>>[]}
     */
    get promises() {
        this.throwIfDisposed();
        return this._source.slice();
    }
    /**
     * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
     * @returns {PromiseBase<any>}
     */
    all() {
        this.throwIfDisposed();
        return TSDNPromise.all(this._source);
    }
    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @returns {PromiseBase<any>} A new Promise.
     */
    race() {
        this.throwIfDisposed();
        return TSDNPromise.race(this._source);
    }
    /**
     * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
     * Unlike .all this method waits for all rejections as well as fulfillment.
     * @returns {PromiseBase<PromiseLike<any>[]>}
     */
    waitAll() {
        this.throwIfDisposed();
        return TSDNPromise.waitAll(this._source);
    }
    /**
     * Waits for all the values to resolve and then applies a transform.
     * @param transform
     * @returns {PromiseBase<Array<any>>}
     */
    map(transform) {
        this.throwIfDisposed();
        return new ArrayPromise(resolve => {
            this.all()
                .doneNow((result) => resolve(result.map(transform)));
        }, true);
    }
    /**
     * Applies a transform to each promise and defers the result.
     * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
     * @param transform
     * @returns {PromiseCollection<U>}
     */
    pipe(transform) {
        this.throwIfDisposed();
        return new PromiseCollection(this._source.map(p => handleSyncIfPossible(p, transform)));
    }
    /**
     * Behaves like array reduce.
     * Creates the promise chain necessary to produce the desired result.
     * @param reduction
     * @param initialValue
     * @returns {PromiseBase<PromiseLike<any>>}
     */
    reduce(reduction, initialValue) {
        this.throwIfDisposed();
        return TSDNPromise.wrap(this._source
            .reduce((previous, current, i, array) => handleSyncIfPossible(previous, (p) => handleSyncIfPossible(current, (c) => reduction(p, c, i, array))), isPromise(initialValue)
            ? initialValue
            : new Fulfilled(initialValue)));
    }
}
var pools;
(function (pools) {
    // export module pending
    // {
    //
    //
    // 	var pool:ObjectPool<Promise<any>>;
    //
    // 	function getPool()
    // 	{
    // 		return pool || (pool = new ObjectPool<Promise<any>>(40, factory, c=>c.dispose()));
    // 	}
    //
    // 	function factory():Promise<any>
    // 	{
    // 		return new Promise();
    // 	}
    //
    // 	export function get():Promise<any>
    // 	{
    // 		var p:any = getPool().take();
    // 		p.__wasDisposed = false;
    // 		p._state = Promise.State.Pending;
    // 		return p;
    // 	}
    //
    // 	export function recycle<T>(c:Promise<T>):void
    // 	{
    // 		if(c) getPool().add(c);
    // 	}
    //
    // }
    //
    // export function recycle<T>(c:PromiseBase<T>):void
    // {
    // 	if(!c) return;
    // 	if(c instanceof Promise && c.constructor==Promise) pending.recycle(c);
    // 	else c.dispose();
    // }
    var PromiseCallbacks;
    (function (PromiseCallbacks) {
        let pool;
        //noinspection JSUnusedLocalSymbols
        function getPool() {
            return pool
                || (pool = new ObjectPool(40, factory, c => {
                    c.onFulfilled = NULL;
                    c.onRejected = NULL;
                    c.promise = NULL;
                }));
        }
        function factory() {
            return {
                onFulfilled: NULL,
                onRejected: NULL,
                promise: NULL
            };
        }
        function init(onFulfilled, onRejected, promise) {
            const c = getPool().take();
            c.onFulfilled = onFulfilled || undefined;
            c.onRejected = onRejected || undefined;
            c.promise = promise;
            return c;
        }
        PromiseCallbacks.init = init;
        function recycle(c) {
            getPool().add(c);
        }
        PromiseCallbacks.recycle = recycle;
    })(PromiseCallbacks = pools.PromiseCallbacks || (pools.PromiseCallbacks = {}));
})(pools || (pools = {}));
(function (TSDNPromise) {
    /**
     * The state of a promise.
     * https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
     * If a promise is disposed the value will be undefined which will also evaluate (promise.state)==false.
     */
    var State;
    (function (State) {
        State[State["Pending"] = 0] = "Pending";
        State[State["Fulfilled"] = 1] = "Fulfilled";
        State[State["Rejected"] = -1] = "Rejected";
    })(State = TSDNPromise.State || (TSDNPromise.State = {}));
    Object.freeze(State);
    function factory(e) {
        return new TSDNPromise(e);
    }
    TSDNPromise.factory = factory;
    function group(first, ...rest) {
        if (!first && !rest.length)
            throw new ArgumentNullException("promises");
        return new PromiseCollection(((first) instanceof (Array) ? first : [first])
            .concat(rest));
    }
    TSDNPromise.group = group;
    function all(first, ...rest) {
        if (!first && !rest.length)
            throw new ArgumentNullException("promises");
        let promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
        if (!promises.length || promises.every(v => !v))
            return new ArrayPromise(r => r(promises), true); // it's a new empty, reuse it. :|
        // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
        return new ArrayPromise((resolve, reject) => {
            let result = [];
            let len = promises.length;
            result.length = len;
            // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
            let remaining = new Set(promises.map((v, i) => i)); // get all the indexes...
            let cleanup = () => {
                reject = VOID0;
                resolve = VOID0;
                promises.length = 0;
                promises = VOID0;
                remaining.dispose();
                remaining = VOID0;
            };
            let checkIfShouldResolve = () => {
                let r = resolve;
                if (r && !remaining.count) {
                    cleanup();
                    r(result);
                }
            };
            let onFulfill = (v, i) => {
                if (resolve) {
                    result[i] = v;
                    remaining.remove(i);
                    checkIfShouldResolve();
                }
            };
            let onReject = (e) => {
                let r = reject;
                if (r) {
                    cleanup();
                    r(e);
                }
            };
            for (let i = 0; remaining && i < len; i++) {
                let p = promises[i];
                if (p)
                    p.then(v => onFulfill(v, i), onReject);
                else
                    remaining.remove(i);
                checkIfShouldResolve();
            }
        });
    }
    TSDNPromise.all = all;
    function waitAll(first, ...rest) {
        if (!first && !rest.length)
            throw new ArgumentNullException("promises");
        const promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy!
        if (!promises.length || promises.every(v => !v))
            return new ArrayPromise(r => r(promises), true); // it's a new empty, reuse it. :|
        // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
        return new ArrayPromise((resolve, reject) => {
            let len = promises.length;
            // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
            let remaining = new Set(promises.map((v, i) => i)); // get all the indexes...
            let cleanup = () => {
                reject = NULL;
                resolve = NULL;
                remaining.dispose();
                remaining = NULL;
            };
            let checkIfShouldResolve = () => {
                let r = resolve;
                if (r && !remaining.count) {
                    cleanup();
                    r(promises);
                }
            };
            let onResolved = (i) => {
                if (remaining) {
                    remaining.remove(i);
                    checkIfShouldResolve();
                }
            };
            for (let i = 0; remaining && i < len; i++) {
                let p = promises[i];
                if (p)
                    p.then(v => onResolved(i), e => onResolved(i));
                else
                    onResolved(i);
            }
        });
    }
    TSDNPromise.waitAll = waitAll;
    function race(first, ...rest) {
        let promises = first && ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copy?
        if (!promises || !promises.length || !(promises = promises.filter(v => v != null)).length)
            throw new ArgumentException("Nothing to wait for.");
        const len = promises.length;
        // Only one?  Nothing to race.
        if (len == 1)
            return wrap(promises[0]);
        // Look for already resolved promises and the first one wins.
        for (let i = 0; i < len; i++) {
            const p = promises[i];
            if (p instanceof PromiseBase && p.isSettled)
                return p;
        }
        return new TSDNPromise((resolve, reject) => {
            let cleanup = () => {
                reject = NULL;
                resolve = NULL;
                promises.length = 0;
                promises = NULL;
            };
            let onResolve = (r, v) => {
                if (r) {
                    cleanup();
                    r(v);
                }
            };
            let onFulfill = (v) => onResolve(resolve, v);
            let onReject = (e) => onResolve(reject, e);
            for (let p of promises) {
                if (!resolve)
                    break;
                p.then(onFulfill, onReject);
            }
        });
    }
    TSDNPromise.race = race;
    function resolve(value) {
        return isPromise(value) ? wrap(value) : new Fulfilled(value);
    }
    TSDNPromise.resolve = resolve;
    /**
     * Syntactic shortcut for avoiding 'new'.
     * @param resolver
     * @param forceSynchronous
     * @returns {TSDNPromise}
     */
    function using(resolver, forceSynchronous = false) {
        return new TSDNPromise(resolver, forceSynchronous);
    }
    TSDNPromise.using = using;
    function resolveAll(first, ...rest) {
        if (!first && !rest.length)
            throw new ArgumentNullException("resolutions");
        return new PromiseCollection(((first) instanceof (Array) ? first : [first])
            .concat(rest)
            .map((v) => resolve(v)));
    }
    TSDNPromise.resolveAll = resolveAll;
    /**
     * Creates a PromiseCollection containing promises that will resolve on the next tick using the transform function.
     * This utility function does not chain promises together to create the result,
     * it only uses one promise per transform.
     * @param source
     * @param transform
     * @returns {PromiseCollection<T>}
     */
    function map(source, transform) {
        return new PromiseCollection(source.map(d => new TSDNPromise((r, j) => {
            try {
                r(transform(d));
            }
            catch (ex) {
                j(ex);
            }
        })));
    }
    TSDNPromise.map = map;
    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    function reject(reason) {
        return new Rejected(reason);
    }
    TSDNPromise.reject = reject;
    /**
     * Takes any Promise-Like object and ensures an extended version of it from this module.
     * @param target The Promise-Like object
     * @returns A new target that simply extends the target.
     */
    function wrap(target) {
        if (!target)
            throw new ArgumentNullException(TARGET);
        return isPromise(target)
            ? (target instanceof PromiseBase ? target : new PromiseWrapper(target))
            : new Fulfilled(target);
    }
    TSDNPromise.wrap = wrap;
    /**
     * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
     * @param then
     * @returns {PromiseWrapper<T>}
     */
    function createFrom(then) {
        if (!then)
            throw new ArgumentNullException(THEN);
        return new PromiseWrapper({ then: then });
    }
    TSDNPromise.createFrom = createFrom;
})(TSDNPromise || (TSDNPromise = {}));
export { TSDNPromise as Promise };
export default TSDNPromise;
//# sourceMappingURL=Promise.js.map