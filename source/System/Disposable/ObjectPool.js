/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implmentations.
 * Uses .add(T) and .take():T
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./dispose", "./DisposableBase", "../Tasks/TaskHandler"], factory);
    }
})(function (require, exports) {
    "use strict";
    var dispose_1 = require("./dispose");
    var DisposableBase_1 = require("./DisposableBase");
    var TaskHandler_1 = require("../Tasks/TaskHandler");
    var ObjectPool = (function (_super) {
        __extends(ObjectPool, _super);
        function ObjectPool(_maxSize, _generator) {
            var _this = this;
            _super.call(this);
            this._maxSize = _maxSize;
            this._generator = _generator;
            this.autoClearTimeout = 5000;
            this._disposableObjectName = "ObjectPool";
            this._pool = [];
            this._trimmer = new TaskHandler_1.default(function () { return _this._trim(); });
            var clear = function () { return _this._clear(); };
            this._flusher = new TaskHandler_1.default(clear);
            this._autoFlusher = new TaskHandler_1.default(clear);
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
            while (pool.length > this._maxSize)
                dispose_1.default.withoutException(pool.pop());
        };
        ObjectPool.prototype.trim = function (defer) {
            this.throwIfDisposed();
            this._trimmer.execute(defer);
        };
        ObjectPool.prototype._clear = function () {
            this._trimmer.cancel();
            this._flusher.cancel();
            this._autoFlusher.cancel();
            dispose_1.default.these(this._pool, true);
            this._pool.length = 0;
        };
        ObjectPool.prototype.clear = function (defer) {
            this.throwIfDisposed();
            this._flusher.execute(defer);
        };
        ObjectPool.prototype.toArrayAndClear = function () {
            this.throwIfDisposed();
            this._trimmer.cancel();
            this._flusher.cancel();
            var p = this._pool;
            if (p) {
                this._pool = [];
                return p;
            }
        };
        ObjectPool.prototype.dump = function () {
            return this.toArrayAndClear();
        };
        ObjectPool.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._generator = null;
            dispose_1.default(this._trimmer, this._flusher, this._autoFlusher);
            this._trimmer = null;
            this._flusher = null;
            this._autoFlusher = null;
            this._pool.length = 0;
            this._pool = null;
        };
        ObjectPool.prototype.extendAutoClear = function () {
            var _ = this, t = _.autoClearTimeout;
            if (isFinite(t) && !_._autoFlusher.isScheduled)
                _._autoFlusher.execute(t);
        };
        ObjectPool.prototype.add = function (o) {
            var _ = this;
            _.throwIfDisposed();
            _._pool.push(o);
            if (_._pool.length > _._maxSize)
                _._trimmer.execute(500);
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
    }(DisposableBase_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ObjectPool;
});
//# sourceMappingURL=ObjectPool.js.map