/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implementations.
 * Uses .add(T) and .take():T
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dispose_1 = require("./dispose");
var DisposableBase_1 = require("./DisposableBase");
var TaskHandler_1 = require("../Threading/Tasks/TaskHandler");
var ArgumentOutOfRangeException_1 = require("../Exceptions/ArgumentOutOfRangeException");
var OBJECT_POOL = "ObjectPool",
    _MAX_SIZE = "_maxSize",
    ABSOLUTE_MAX_SIZE = 65536,
    MUST_BE_GT1 = "Must be at valid number least 1.",
    MUST_BE_LTM = "Must be less than or equal to " + ABSOLUTE_MAX_SIZE + ".";

var ObjectPool = function (_DisposableBase_1$Dis) {
    _inherits(ObjectPool, _DisposableBase_1$Dis);

    function ObjectPool(_maxSize, _generator, _recycler) {
        _classCallCheck(this, ObjectPool);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectPool).call(this));

        _this._maxSize = _maxSize;
        _this._generator = _generator;
        _this._recycler = _recycler;
        _this.autoClearTimeout = 5000;
        if (isNaN(_maxSize) || _maxSize < 1) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_GT1);
        if (_maxSize > ABSOLUTE_MAX_SIZE) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_LTM);
        _this._localAbsMaxSize = Math.min(_maxSize * 2, ABSOLUTE_MAX_SIZE);
        var _ = _this;
        _._disposableObjectName = OBJECT_POOL;
        _._pool = [];
        _._trimmer = new TaskHandler_1.TaskHandler(function () {
            return _._trim();
        });
        var clear = function clear() {
            return _._clear();
        };
        _._flusher = new TaskHandler_1.TaskHandler(clear);
        _._autoFlusher = new TaskHandler_1.TaskHandler(clear);
        return _this;
    }

    _createClass(ObjectPool, [{
        key: "_trim",
        value: function _trim() {
            var pool = this._pool;
            while (pool.length > this._maxSize) {
                dispose_1.dispose.withoutException(pool.pop());
            }
        }
    }, {
        key: "trim",
        value: function trim(defer) {
            this.throwIfDisposed();
            this._trimmer.start(defer);
        }
    }, {
        key: "_clear",
        value: function _clear() {
            var _ = this,
                p = _._pool;
            _._trimmer.cancel();
            _._flusher.cancel();
            _._autoFlusher.cancel();
            dispose_1.dispose.these(p, true);
            p.length = 0;
        }
    }, {
        key: "clear",
        value: function clear(defer) {
            this.throwIfDisposed();
            this._flusher.start(defer);
        }
    }, {
        key: "toArrayAndClear",
        value: function toArrayAndClear() {
            var _ = this;
            _.throwIfDisposed();
            _._trimmer.cancel();
            _._flusher.cancel();
            var p = _._pool;
            _._pool = [];
            return p;
        }
    }, {
        key: "dump",
        value: function dump() {
            return this.toArrayAndClear();
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(ObjectPool.prototype), "_onDispose", this).call(this);
            var _ = this;
            _._generator = null;
            _._recycler = null;
            dispose_1.dispose(_._trimmer, _._flusher, _._autoFlusher);
            _._trimmer = null;
            _._flusher = null;
            _._autoFlusher = null;
            _._pool.length = 0;
            _._pool = null;
        }
    }, {
        key: "extendAutoClear",
        value: function extendAutoClear() {
            var _ = this;
            _.throwIfDisposed();
            var t = _.autoClearTimeout;
            if (isFinite(t) && !_._autoFlusher.isScheduled) _._autoFlusher.start(t);
        }
    }, {
        key: "add",
        value: function add(o) {
            var _ = this;
            _.throwIfDisposed();
            if (_._pool.length >= _._localAbsMaxSize) {
                dispose_1.dispose(o);
            } else {
                if (_._recycler) _._recycler(o);
                _._pool.push(o);
                var m = _._maxSize;
                if (m < ABSOLUTE_MAX_SIZE && _._pool.length > m) _._trimmer.start(500);
            }
            _.extendAutoClear();
        }
    }, {
        key: "take",
        value: function take() {
            var _ = this;
            _.throwIfDisposed();
            var e = _._pool.pop() || _._generator(),
                len = _._pool.length;
            if (_._pool.length <= _._maxSize) _._trimmer.cancel();
            if (len) _.extendAutoClear();
            return e;
        }
    }, {
        key: "maxSize",
        get: function get() {
            return this._maxSize;
        }
    }, {
        key: "count",
        get: function get() {
            var p = this._pool;
            return p ? p.length : 0;
        }
    }]);

    return ObjectPool;
}(DisposableBase_1.DisposableBase);

exports.ObjectPool = ObjectPool;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObjectPool;
//# sourceMappingURL=ObjectPool.js.map
