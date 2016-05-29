/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
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
const VOID0 = void 0, PROMISE = "Promise", PROMISE_STATE = PROMISE + "State", THEN = "then", TARGET = "target";
function isPromise(value) {
    return Type.hasMemberOfType(value, THEN, Type.FUNCTION);
}
function resolve(value, resolver, promiseFactory) {
    let nextValue = resolver
        ? resolver(value)
        : value;
    return nextValue && isPromise(nextValue)
        ? Promise.wrap(nextValue)
        : promiseFactory(nextValue);
}
function handleResolution(p, value, resolver) {
    try {
        let v = resolver ? resolver(value) : value;
        if (p)
            p.resolve(v);
    }
    catch (ex) {
        p.reject(ex);
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
    if (p instanceof PromiseBase)
        p.thenThis(onFulfilled, onRejected);
    else
        p.then(onFulfilled, onRejected);
}
function newODE() {
    return new ObjectDisposedException("Promise", "An underlying promise-result was disposed.");
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
        return this.getState() === Promise.State.Pending;
    }
    get isSettled() {
        return this.getState() != Promise.State.Pending;
    }
    get isFulfilled() {
        return this.getState() === Promise.State.Fulfilled;
    }
    get isRejected() {
        return this.getState() === Promise.State.Rejected;
    }
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
        super(Promise.State.Pending);
        this._disposableObjectName = PROMISE;
    }
    then(onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
            this.thenThis(result => handleResolutionMethods(resolve, reject, result, onFulfilled), error => onRejected
                ? handleResolutionMethods(resolve, null, error, onRejected)
                : reject(error));
        });
    }
    done(onFulfilled, onRejected) {
        defer(() => this.thenThis(onFulfilled, onRejected));
    }
    delayFromNow(milliseconds = 0) {
        this.throwIfDisposed();
        return new Promise((resolve, reject) => {
            defer(() => {
                this.thenThis(v => resolve(v), e => reject(e));
            }, milliseconds);
        }, true);
    }
    delayAfterResolve(milliseconds = 0) {
        this.throwIfDisposed();
        if (this.isSettled)
            return this.delayFromNow(milliseconds);
        return new Promise((resolve, reject) => {
            this.thenThis(v => defer(() => resolve(v), milliseconds), e => defer(() => reject(e), milliseconds));
        }, true);
    }
    'catch'(onRejected) {
        this.throwIfDisposed();
        return this.then(VOID0, onRejected);
    }
    'finally'(fin) {
        this.throwIfDisposed();
        return this.then(fin, fin);
    }
    finallyThis(fin) {
        this.throwIfDisposed();
        var f = () => deferImmediate(fin);
        this.thenThis(f, f);
        return this;
    }
}
export class Resolvable extends PromiseBase {
    thenSynchronous(onFulfilled, onRejected) {
        this.throwIfDisposed();
        try {
            switch (this.state) {
                case Promise.State.Fulfilled:
                    return onFulfilled
                        ? resolve(this._result, onFulfilled, Promise.resolve)
                        : this;
                case Promise.State.Rejected:
                    return onRejected
                        ? resolve(this._error, onRejected, Promise.resolve)
                        : this;
            }
        }
        catch (ex) {
            return new Rejected(ex);
        }
        throw new Error("Invalid state for a resolved promise.");
    }
    thenThis(onFulfilled, onRejected) {
        this.throwIfDisposed();
        switch (this.state) {
            case Promise.State.Fulfilled:
                if (onFulfilled)
                    onFulfilled(this._result);
                break;
            case Promise.State.Rejected:
                if (onRejected)
                    onRejected(this._error);
                break;
        }
        return this;
    }
}
export class Resolved extends Resolvable {
    constructor(state, result, error) {
        super();
        this._result = result;
        this._error = error;
        this._state = state;
    }
}
class Fulfilled extends Resolved {
    constructor(value) {
        super(Promise.State.Fulfilled, value);
    }
}
class Rejected extends Resolved {
    constructor(error) {
        super(Promise.State.Rejected, VOID0, error);
    }
}
class PromiseWrapper extends Resolvable {
    constructor(_target) {
        super();
        this._target = _target;
        if (!_target)
            throw new ArgumentNullException(TARGET);
        if (!isPromise(_target))
            throw new ArgumentException(TARGET, "Must be a promise-like object.");
        _target.then(v => {
            this._state = Promise.State.Fulfilled;
            this._result = v;
            this._error = VOID0;
            this._target = VOID0;
        }, e => {
            this._state = Promise.State.Rejected;
            this._error = e;
            this._target = VOID0;
        });
    }
    thenSynchronous(onFulfilled, onRejected) {
        this.throwIfDisposed();
        var t = this._target;
        if (!t)
            return super.thenSynchronous(onFulfilled, onRejected);
        return new Promise((resolve, reject) => {
            handleDispatch(t, result => handleResolutionMethods(resolve, reject, result, onFulfilled), error => onRejected
                ? handleResolutionMethods(resolve, null, error, onRejected)
                : reject(error));
        }, true);
    }
    thenThis(onFulfilled, onRejected) {
        this.throwIfDisposed();
        var t = this._target;
        if (!t)
            return super.thenThis(onFulfilled, onRejected);
        handleDispatch(t, onFulfilled, onRejected);
        return this;
    }
    _onDispose() {
        super._onDispose();
        this._target = VOID0;
    }
}
export class Promise extends Resolvable {
    constructor(resolver, forceSynchronous = false) {
        super();
        if (resolver)
            this.resolveUsing(resolver, forceSynchronous);
    }
    thenSynchronous(onFulfilled, onRejected) {
        this.throwIfDisposed();
        if (this._state)
            return super.thenSynchronous(onFulfilled, onRejected);
        var p = new Promise();
        (this._waiting || (this._waiting = []))
            .push(pools.PromiseCallbacks.init(onFulfilled, onRejected, p));
        return p;
    }
    thenThis(onFulfilled, onRejected) {
        this.throwIfDisposed();
        if (this._state)
            return super.thenThis(onFulfilled, onRejected);
        (this._waiting || (this._waiting = []))
            .push(pools.PromiseCallbacks.init(onFulfilled, onRejected));
        return this;
    }
    _onDispose() {
        super._onDispose();
        this._resolvedCalled = VOID0;
    }
    resolveUsing(resolver, forceSynchronous = false, throwIfSettled = false) {
        if (!resolver)
            throw new ArgumentNullException("resolver");
        if (this._resolvedCalled)
            throw new InvalidOperationException(".resolve() already called.");
        if (this.state)
            throw new InvalidOperationException("Already resolved: " + Promise.State[this.state]);
        this._resolvedCalled = true;
        var state = 0;
        var rejectHandler = (reason) => {
            if (state) {
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
        var fulfillHandler = (v) => {
            if (state) {
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
        if (forceSynchronous)
            resolver(fulfillHandler, rejectHandler);
        else
            deferImmediate(() => resolver(fulfillHandler, rejectHandler));
    }
    _emitDisposalRejection(p) {
        var d = p.wasDisposed;
        if (d)
            this._rejectInternal(newODE());
        return d;
    }
    _resolveInternal(result) {
        if (this.wasDisposed)
            return;
        while (result instanceof PromiseBase) {
            let r = result;
            if (this._emitDisposalRejection(r))
                return;
            switch (r.state) {
                case Promise.State.Pending:
                    r.thenSynchronous(v => this._resolveInternal(v), e => this._rejectInternal(e));
                    return;
                case Promise.State.Rejected:
                    this._rejectInternal(r.error);
                    return;
                case Promise.State.Fulfilled:
                    result = r.result;
                    break;
            }
        }
        if (isPromise(result)) {
            result.then(v => this._resolveInternal(v), e => this._rejectInternal(e));
        }
        else {
            this._state = Promise.State.Fulfilled;
            this._result = result;
            this._error = VOID0;
            var o = this._waiting;
            if (o) {
                this._waiting = VOID0;
                for (let c of o) {
                    let { onFulfilled, promise } = c, p = promise;
                    pools.PromiseCallbacks.recycle(c);
                    handleResolution(p, result, onFulfilled);
                }
                o.length = 0;
            }
        }
    }
    _rejectInternal(error) {
        if (this.wasDisposed)
            return;
        this._state = Promise.State.Rejected;
        this._error = error;
        var o = this._waiting;
        if (o) {
            this._waiting = null;
            for (let c of o) {
                let { onRejected, promise } = c, p = promise;
                pools.PromiseCallbacks.recycle(c);
                if (onRejected)
                    handleResolution(p, error, onRejected);
                else
                    p.reject(error);
            }
            o.length = 0;
        }
    }
    resolve(result, throwIfSettled = false) {
        this.throwIfDisposed();
        if (result == this)
            throw new InvalidOperationException("Cannot resolve a promise as itself.");
        if (this._state) {
            if (!throwIfSettled || this._state == Promise.State.Fulfilled && this._result === result)
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
            if (!throwIfSettled || this._state == Promise.State.Rejected && this._error === error)
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
var pools;
(function (pools) {
    var PromiseCallbacks;
    (function (PromiseCallbacks) {
        var pool;
        function getPool() {
            return pool
                || (pool = new ObjectPool(40, factory, c => {
                    c.onFulfilled = null;
                    c.onRejected = null;
                    c.promise = null;
                }));
        }
        function factory() {
            return {
                onFulfilled: null,
                onRejected: null,
                promise: null
            };
        }
        function init(onFulfilled, onRejected, promise) {
            var c = getPool().take();
            c.onFulfilled = onFulfilled;
            c.onRejected = onRejected;
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
(function (Promise) {
    (function (State) {
        State[State["Pending"] = 0] = "Pending";
        State[State["Fulfilled"] = 1] = "Fulfilled";
        State[State["Rejected"] = -1] = "Rejected";
    })(Promise.State || (Promise.State = {}));
    var State = Promise.State;
    Object.freeze(State);
    function all(first, ...rest) {
        if (!first && !rest.length)
            throw new ArgumentNullException("promises");
        var promises = (Array.isArray(first) ? first : [first]).concat(rest);
        if (!promises.length || promises.every(v => !v))
            return new Fulfilled(promises);
        return new Promise((resolve, reject) => {
            let checkedAll = false;
            let result = [];
            let len = promises.length;
            result.length = len;
            let remaining = new Set(promises.map((v, i) => i));
            let cleanup = () => {
                reject = null;
                resolve = null;
                promises.length = 0;
                promises = null;
                remaining.dispose();
                remaining = null;
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
    Promise.all = all;
    function waitAll(first, ...rest) {
        if (!first && !rest.length)
            throw new ArgumentNullException("promises");
        var promises = (Array.isArray(first) ? first : [first]).concat(rest);
        if (!promises.length || promises.every(v => !v))
            return new Fulfilled(promises);
        return new Promise((resolve, reject) => {
            let checkedAll = false;
            let len = promises.length;
            let remaining = new Set(promises.map((v, i) => i));
            let cleanup = () => {
                reject = null;
                resolve = null;
                remaining.dispose();
                remaining = null;
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
    Promise.waitAll = waitAll;
    function race(first, ...rest) {
        var promises = first && (Array.isArray(first) ? first : [first]).concat(rest);
        if (!promises || !promises.length || !(promises = promises.filter(v => v != null)).length)
            throw new ArgumentException("Nothing to wait for.");
        var len = promises.length;
        if (len == 1)
            return wrap(promises[0]);
        for (let i = 0; i < len; i++) {
            var p = promises[i];
            if (p instanceof PromiseBase && p.isSettled)
                return p;
        }
        return new Promise((resolve, reject) => {
            let cleanup = () => {
                reject = null;
                resolve = null;
                promises.length = 0;
                promises = null;
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
    Promise.race = race;
    function resolve(value) {
        return isPromise(value) ? wrap(value) : new Fulfilled(value);
    }
    Promise.resolve = resolve;
    function reject(reason) {
        return new Rejected(reason);
    }
    Promise.reject = reject;
    function wrap(target) {
        if (!target)
            throw new ArgumentNullException(TARGET);
        return target instanceof PromiseBase ? target : new PromiseWrapper(target);
    }
    Promise.wrap = wrap;
    function createFrom(then) {
        if (!then)
            throw new ArgumentNullException(THEN);
        return new PromiseWrapper({ then: then });
    }
    Promise.createFrom = createFrom;
})(Promise || (Promise = {}));
//# sourceMappingURL=Promise.js.map