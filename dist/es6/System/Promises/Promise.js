/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
import Type from "../Types";
import { deferImmediate } from "../Tasks/deferImmediate";
import { defer } from "../Tasks/defer";
import { DisposableBase } from "../Disposable/DisposableBase";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ObjectPool } from "../Disposable/ObjectPool";
import { Set } from "../Collections/Set";
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
function pass(source, dest) {
    return () => {
        source.then(v => {
            dest.resolve(v);
            return dest;
        }, e => {
            dest.reject(e);
            return dest;
        });
    };
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
function handleDispatch(p, onFulfilled, onRejected) {
    if (p instanceof Promise)
        p.thenThis(onFulfilled, onRejected);
    else
        p.then(onFulfilled, onRejected);
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
    deferAll() {
        this.throwIfDisposed();
        return new SubsequentDeferred(this);
    }
    defer() {
        this.throwIfDisposed();
        var p = Promise.pending();
        deferImmediate(pass(this, p));
        return p;
    }
    delay(milliseconds) {
        this.throwIfDisposed();
        var p = Promise.pending();
        defer(pass(this, p), milliseconds);
        return p;
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
        this.thenThis(fin, fin);
        return this;
    }
}
export class Resolvable extends PromiseBase {
    then(onFulfilled, onRejected) {
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
    then(onFulfilled, onRejected) {
        this.throwIfDisposed();
        var t = this._target;
        if (!t)
            return super.then(onFulfilled, onRejected);
        var p = Promise.pending();
        handleDispatch(t, result => handleResolution(p, result, onFulfilled), error => onRejected ? handleResolution(p, error, onRejected) : p.reject(error));
        return p;
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
    constructor(resolver, resolveImmediate = false) {
        super();
        if (resolver)
            this.resolveUsing(resolver, !resolveImmediate);
    }
    then(onFulfilled, onRejected) {
        this.throwIfDisposed();
        if (this._state)
            return super.then(onFulfilled, onRejected);
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
    resolveUsing(resolver, deferResolution = false, throwIfSettled = false) {
        if (!resolver)
            throw new ArgumentNullException("resolver");
        if (this._resolvedCalled)
            throw new InvalidOperationException(".resolve() already called.");
        if (this.state)
            throw new InvalidOperationException("Already resolved: " + Promise.State[this.state]);
        this._resolvedCalled = true;
        var rejectHandler = (reason) => {
            this._resolvedCalled = false;
            this.reject(reason);
        };
        var fulfillHandler = (v) => {
            this._resolvedCalled = false;
            this.resolve(v);
        };
        var r = () => resolver(v => {
            if (v == this)
                throw new InvalidOperationException("Cannot resolve a promise as itself.");
            if (isPromise(v))
                handleDispatch(v, fulfillHandler, rejectHandler);
            else
                fulfillHandler(v);
        }, rejectHandler);
        if (deferResolution)
            deferImmediate(r);
        else
            r();
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
}
class SubsequentDeferred extends PromiseBase {
    constructor(_parent) {
        super();
        this._parent = _parent;
        if (!_parent || !(_parent instanceof PromiseBase))
            throw new ArgumentException(TARGET, "Must be of type Promise.");
    }
    _onDisposed() {
        super._onDispose();
        this._parent = VOID0;
    }
    getState() {
        return this._parent.state;
    }
    getResult() {
        return this._parent.result;
    }
    getError() {
        return this._parent.error;
    }
    then(onFulfilled, onRejected) {
        this.throwIfDisposed();
        var d = this._parent.defer();
        var p = d.then(onFulfilled, onRejected);
        d.finally(() => pools.recycle(d));
        return p;
    }
    thenThis(onFulfilled, onRejected) {
        this.throwIfDisposed();
        var d = this._parent.defer();
        d.thenThis(onFulfilled, onRejected);
        d.finally(() => pools.recycle(d));
        return this;
    }
    defer() {
        this.throwIfDisposed();
        return this;
    }
    deferAll() {
        this.throwIfDisposed();
        return this;
    }
    get parent() {
        return this._parent;
    }
}
export class LazyResolved extends Resolved {
    constructor(_factory) {
        super(Promise.State.Pending, VOID0);
        this._factory = _factory;
        if (!_factory)
            throw new ArgumentNullException("factory");
    }
    _onDispose() {
        super._onDispose();
        this._factory = VOID0;
    }
    getState() {
        this.getResult();
        return this._state;
    }
    getResult() {
        if (!this._state) {
            try {
                this._result = this._factory();
                this._state = Promise.State.Fulfilled;
            }
            catch (ex) {
                this._error = ex;
                this._state = Promise.State.Rejected;
            }
            this._factory = VOID0;
        }
        return this._result;
    }
    getError() {
        this.getResult();
        return this._error;
    }
    then(onFulfilled, onRejected) {
        this.throwIfDisposed();
        this.getResult();
        return super.then(onFulfilled, onRejected);
    }
    thenThis(onFulfilled, onRejected) {
        this.throwIfDisposed();
        this.getResult();
        return super.thenThis(onFulfilled, onRejected);
    }
    resolve() {
        this.getResult();
        return this;
    }
    get isResolved() {
        return !this._factory;
    }
}
export class LazyPromise extends Promise {
    constructor(_resolver) {
        super();
        this._resolver = _resolver;
        if (!_resolver)
            throw new ArgumentNullException("resolver");
        this._resolvedCalled = true;
    }
    _onDispose() {
        super._onDispose();
        this._resolver = VOID0;
    }
    _onThen() {
        var r = this._resolver;
        if (r) {
            this._resolver = VOID0;
            this._resolvedCalled = false;
            this.resolveUsing(r, true);
        }
    }
    then(onFulfilled, onRejected) {
        this._onThen();
        return super.then(onFulfilled, onRejected);
    }
    thenThis(onFulfilled, onRejected) {
        this._onThen();
        return super.thenThis(onFulfilled, onRejected);
    }
}
var pools;
(function (pools) {
    var pending;
    (function (pending) {
        var pool;
        function getPool() {
            return pool || (pool = new ObjectPool(40, factory));
        }
        function factory() {
            return new Promise();
        }
        function get() {
            var p = getPool().take();
            p.__wasDisposed = false;
            p._state = Promise.State.Pending;
            return p;
        }
        pending.get = get;
        function recycle(c) {
            if (!c)
                return;
            c.dispose();
            getPool().add(c);
        }
        pending.recycle = recycle;
    })(pending = pools.pending || (pools.pending = {}));
    function recycle(c) {
        if (!c)
            return;
        if (c instanceof Promise)
            pending.recycle(c);
        else
            c.dispose();
    }
    pools.recycle = recycle;
    var PromiseCallbacks;
    (function (PromiseCallbacks) {
        var pool;
        function getPool() {
            return pool || (pool = new ObjectPool(40, factory));
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
            c.onFulfilled = null;
            c.onRejected = null;
            c.promise = null;
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
        var len = promises.length;
        for (let i = 0; i < len; i++) {
            var p = promises[i];
            if (p instanceof SubsequentDeferred)
                promises[i] = p.parent;
        }
        return pending((resolve, reject) => {
            let checkedAll = false;
            let result = [];
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
    function race(first, ...rest) {
        var promises = first && (Array.isArray(first) ? first : [first]).concat(rest);
        if (!promises || !promises.length || !(promises = promises.filter(v => v != null)).length)
            throw new ArgumentException("Nothing to wait for.");
        var len = promises.length;
        if (len == 1)
            return wrap(promises[0]).defer();
        for (let i = 0; i < len; i++) {
            var p = promises[i];
            if (p instanceof SubsequentDeferred)
                p = p.parent;
            if (p instanceof LazyResolved) {
                if (p.isResolved)
                    return p.defer();
            }
            else if (p instanceof Resolved || p instanceof PromiseBase && p.isSettled) {
                return p.defer();
            }
        }
        return pending((resolve, reject) => {
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
    var lazy;
    (function (lazy) {
        function resolve(factory) {
            return new LazyResolved(factory);
        }
        lazy.resolve = resolve;
        function pending(resolver) {
            return new LazyPromise(resolver);
        }
        lazy.pending = pending;
    })(lazy = Promise.lazy || (Promise.lazy = {}));
    function wrap(target) {
        if (!target)
            throw new ArgumentNullException(TARGET);
        return target instanceof Promise ? this : new PromiseWrapper(target);
    }
    Promise.wrap = wrap;
    function createFrom(then) {
        if (!then)
            throw new ArgumentNullException(THEN);
        return new PromiseWrapper({ then: then });
    }
    Promise.createFrom = createFrom;
    function pending(resolver) {
        var p = pools.pending.get();
        if (resolver)
            p.resolveUsing(resolver);
        return p;
    }
    Promise.pending = pending;
})(Promise || (Promise = {}));
//# sourceMappingURL=Promise.js.map