/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implementations.
 * Uses .add(T) and .take():T
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./dispose", "./DisposableBase", "../Threading/Tasks/TaskHandler", "../Exceptions/ArgumentOutOfRangeException", "../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var dispose_1 = require("./dispose");
    var DisposableBase_1 = require("./DisposableBase");
    var TaskHandler_1 = require("../Threading/Tasks/TaskHandler");
    var ArgumentOutOfRangeException_1 = require("../Exceptions/ArgumentOutOfRangeException");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var OBJECT_POOL = "ObjectPool", _MAX_SIZE = "_maxSize", ABSOLUTE_MAX_SIZE = 65536, MUST_BE_GT1 = "Must be at valid number least 1.", MUST_BE_LTM = "Must be less than or equal to " + ABSOLUTE_MAX_SIZE + ".";
    var ObjectPool = (function (_super) {
        __extends(ObjectPool, _super);
        function ObjectPool(_maxSize, _generator, _recycler) {
            _super.call(this);
            this._maxSize = _maxSize;
            this._generator = _generator;
            this._recycler = _recycler;
            this.autoClearTimeout = 5000;
            if (isNaN(_maxSize) || _maxSize < 1)
                throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_GT1);
            if (_maxSize > ABSOLUTE_MAX_SIZE)
                throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_LTM);
            this._localAbsMaxSize = Math.min(_maxSize * 2, ABSOLUTE_MAX_SIZE);
            var _ = this;
            _._disposableObjectName = OBJECT_POOL;
            _._pool = [];
            _._trimmer = new TaskHandler_1.TaskHandler(function () { return _._trim(); });
            var clear = function () { return _._clear(); };
            _._flusher = new TaskHandler_1.TaskHandler(clear);
            _._autoFlusher = new TaskHandler_1.TaskHandler(clear);
        }
        Object.defineProperty(ObjectPool.prototype, "maxSize", {
            get: function () {
                return this._maxSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectPool.prototype, "count", {
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
                dispose_1.dispose.withoutException(pool.pop());
            }
        };
        ObjectPool.prototype.trim = function (defer) {
            this.throwIfDisposed();
            this._trimmer.start(defer);
        };
        ObjectPool.prototype._clear = function () {
            var _ = this, p = _._pool;
            _._trimmer.cancel();
            _._flusher.cancel();
            _._autoFlusher.cancel();
            dispose_1.dispose.these(p, true);
            p.length = 0;
        };
        ObjectPool.prototype.clear = function (defer) {
            this.throwIfDisposed();
            this._flusher.start(defer);
        };
        ObjectPool.prototype.toArrayAndClear = function () {
            var _ = this;
            _.throwIfDisposed();
            _._trimmer.cancel();
            _._flusher.cancel();
            var p = _._pool;
            _._pool = [];
            return p;
        };
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
        ObjectPool.prototype.take = function () {
            var _ = this;
            _.throwIfDisposed();
            var e = _._pool.pop() || _._generator(), len = _._pool.length;
            if (_._pool.length <= _._maxSize)
                _._trimmer.cancel();
            if (len)
                _.extendAutoClear();
            return e;
        };
        return ObjectPool;
    }(DisposableBase_1.DisposableBase));
    exports.ObjectPool = ObjectPool;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ObjectPool;
});
//# sourceMappingURL=ObjectPool.js.map