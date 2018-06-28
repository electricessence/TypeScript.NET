/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implementations.
 * Uses .add(T) and .take():T
 */
System.register(["./dispose", "./DisposableBase", "../Threading/Tasks/TaskHandler", "../Exceptions/ArgumentOutOfRangeException", "../Exceptions/ArgumentException", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var dispose_1, DisposableBase_1, TaskHandler_1, ArgumentOutOfRangeException_1, ArgumentException_1, extends_1, __extends, OBJECT_POOL, _MAX_SIZE, ABSOLUTE_MAX_SIZE, MUST_BE_GT1, MUST_BE_LTM, ObjectPool;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (dispose_1_1) {
                dispose_1 = dispose_1_1;
            },
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (TaskHandler_1_1) {
                TaskHandler_1 = TaskHandler_1_1;
            },
            function (ArgumentOutOfRangeException_1_1) {
                ArgumentOutOfRangeException_1 = ArgumentOutOfRangeException_1_1;
            },
            function (ArgumentException_1_1) {
                ArgumentException_1 = ArgumentException_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implementations.
             * Uses .add(T) and .take():T
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            OBJECT_POOL = "ObjectPool", _MAX_SIZE = "_maxSize", ABSOLUTE_MAX_SIZE = 65536, MUST_BE_GT1 = "Must be at valid number least 1.", MUST_BE_LTM = "Must be less than or equal to " + ABSOLUTE_MAX_SIZE + ".";
            ObjectPool = /** @class */ (function (_super) {
                __extends(ObjectPool, _super);
                function ObjectPool(_maxSize, _generator, _recycler) {
                    var _this = _super.call(this, OBJECT_POOL) || this;
                    _this._maxSize = _maxSize;
                    _this._generator = _generator;
                    _this._recycler = _recycler;
                    /**
                     * By default will clear after 5 seconds of non-use.
                     */
                    _this.autoClearTimeout = 5000;
                    if (isNaN(_maxSize) || _maxSize < 1)
                        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_GT1);
                    if (_maxSize > ABSOLUTE_MAX_SIZE)
                        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_LTM);
                    _this._localAbsMaxSize = Math.min(_maxSize * 2, ABSOLUTE_MAX_SIZE);
                    _this._pool = [];
                    _this._trimmer = new TaskHandler_1.TaskHandler(function () { return _this._trim(); });
                    var clear = function () { return _this._clear(); };
                    _this._flusher = new TaskHandler_1.TaskHandler(clear);
                    _this._autoFlusher = new TaskHandler_1.TaskHandler(clear);
                    return _this;
                }
                Object.defineProperty(ObjectPool.prototype, "maxSize", {
                    /**
                     * Defines the maximum at which trimming should allow.
                     * @returns {number}
                     */
                    get: function () {
                        return this._maxSize;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ObjectPool.prototype, "count", {
                    /**
                     * Current number of objects in pool.
                     * @returns {number}
                     */
                    get: function () {
                        var p = this._pool;
                        return p ? p.length : 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                ObjectPool.prototype._trim = function () {
                    var pool = this._pool;
                    while (pool.length > this._maxSize) {
                        dispose_1.dispose.single(pool.pop(), true);
                    }
                };
                /**
                 * Will trim ensure the pool is less than the maxSize.
                 * @param defer A delay before trimming.  Will be overridden by later calls.
                 */
                ObjectPool.prototype.trim = function (defer) {
                    this.throwIfDisposed();
                    this._trimmer.start(defer);
                };
                ObjectPool.prototype._clear = function () {
                    var _ = this;
                    var p = _._pool;
                    _._trimmer.cancel();
                    _._flusher.cancel();
                    _._autoFlusher.cancel();
                    dispose_1.dispose.these.noCopy(p, true);
                    p.length = 0;
                };
                /**
                 * Will clear out the pool.
                 * Cancels any scheduled trims when executed.
                 * @param defer A delay before clearing.  Will be overridden by later calls.
                 */
                ObjectPool.prototype.clear = function (defer) {
                    this.throwIfDisposed();
                    this._flusher.start(defer);
                };
                ObjectPool.prototype.toArrayAndClear = function () {
                    this.throwIfDisposed();
                    this._trimmer.cancel();
                    this._flusher.cancel();
                    var p = this._pool;
                    this._pool = [];
                    return p;
                };
                /**
                 * Shortcut for toArrayAndClear();
                 */
                ObjectPool.prototype.dump = function () {
                    return this.toArrayAndClear();
                };
                ObjectPool.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    var _ = this;
                    _._generator = null;
                    _._recycler = null;
                    dispose_1.dispose(_._trimmer, _._flusher, _._autoFlusher);
                    _._trimmer = null;
                    _._flusher = null;
                    _._autoFlusher = null;
                    _._pool.length = 0;
                    _._pool = null;
                };
                ObjectPool.prototype.extendAutoClear = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    var t = _.autoClearTimeout;
                    if (isFinite(t) && !_._autoFlusher.isScheduled)
                        _._autoFlusher.start(t);
                };
                ObjectPool.prototype.add = function (o) {
                    var _ = this;
                    _.throwIfDisposed();
                    if (_._pool.length >= _._localAbsMaxSize) {
                        // Getting too big, dispose immediately...
                        dispose_1.dispose(o);
                    }
                    else {
                        if (_._recycler)
                            _._recycler(o);
                        _._pool.push(o);
                        var m = _._maxSize;
                        if (m < ABSOLUTE_MAX_SIZE && _._pool.length > m)
                            _._trimmer.start(500);
                    }
                    _.extendAutoClear();
                };
                ObjectPool.prototype._onTaken = function () {
                    var _ = this, len = _._pool.length;
                    if (len <= _._maxSize)
                        _._trimmer.cancel();
                    if (len)
                        _.extendAutoClear();
                };
                ObjectPool.prototype.tryTake = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    try {
                        return _._pool.pop();
                    }
                    finally {
                        _._onTaken();
                    }
                };
                ObjectPool.prototype.take = function (factory) {
                    var _ = this;
                    _.throwIfDisposed();
                    if (!_._generator && !factory)
                        throw new ArgumentException_1.ArgumentException('factory', "Must provide a factory if on was not provided at construction time.");
                    try {
                        return _._pool.pop() || factory && factory() || _._generator();
                    }
                    finally {
                        _._onTaken();
                    }
                };
                return ObjectPool;
            }(DisposableBase_1.DisposableBase));
            exports_1("ObjectPool", ObjectPool);
            exports_1("default", ObjectPool);
        }
    };
});
//# sourceMappingURL=ObjectPool.js.map