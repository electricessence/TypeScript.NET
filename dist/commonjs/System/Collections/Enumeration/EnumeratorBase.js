"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../../Types");
var DisposableBase_1 = require("../../Disposable/DisposableBase");
var ObjectPool_1 = require("../../Disposable/ObjectPool");
var IteratorResult_1 = require("./IteratorResult");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var VOID0 = void 0;
var yielderPool;
//noinspection JSUnusedLocalSymbols
function yielder(recycle) {
    if (!yielderPool)
        yielderPool
            = new ObjectPool_1.ObjectPool(40, function () { return new Yielder(); }, function (y) { return y.yieldBreak(); });
    if (!recycle)
        return yielderPool.take();
    yielderPool.add(recycle);
}
var Yielder = /** @class */ (function () {
    function Yielder() {
        this._current = VOID0;
        this._index = NaN;
    }
    Object.defineProperty(Yielder.prototype, "current", {
        get: function () { return this._current; } // this class is not entirely local/private.  Still needs protection.
        ,
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Yielder.prototype, "index", {
        get: function () { return this._index; },
        enumerable: true,
        configurable: true
    });
    Yielder.prototype.yieldReturn = function (value) {
        this._current = value;
        if (isNaN(this._index))
            this._index = 0;
        else
            this._index++;
        return true;
    };
    Yielder.prototype.yieldBreak = function () {
        this._current = VOID0;
        this._index = NaN;
        return false;
    };
    Yielder.prototype.dispose = function () {
        this.yieldBreak();
    };
    return Yielder;
}());
var NAME = "EnumeratorBase";
// "Enumerator" is conflict JScript's "Enumerator"
// Naming this class EnumeratorBase to avoid collision with IE.
var EnumeratorBase = /** @class */ (function (_super) {
    __extends(EnumeratorBase, _super);
    function EnumeratorBase(_initializer, _tryGetNext, disposer, isEndless) {
        var _this = _super.call(this, NAME) || this;
        _this._initializer = _initializer;
        _this._tryGetNext = _tryGetNext;
        _this.reset();
        if (Types_1.Type.isBoolean(isEndless))
            _this._isEndless = isEndless;
        else if (Types_1.Type.isBoolean(disposer))
            _this._isEndless = disposer;
        else
            _this._isEndless = false;
        if (Types_1.Type.isFunction(disposer))
            _this._disposer = disposer;
        return _this;
    }
    Object.defineProperty(EnumeratorBase.prototype, "current", {
        get: function () {
            var y = this._yielder;
            return y && y.current;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumeratorBase.prototype, "index", {
        get: function () {
            var y = this._yielder;
            return y ? y.index : NaN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumeratorBase.prototype, "isEndless", {
        /*
         * Provides a mechanism to indicate if this enumerable never ends.
         * If set to true, some operations that expect a finite result may throw.
         * Explicit false means it has an end.
         * Implicit void means unknown.
         */
        get: function () {
            return this._isEndless;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Added for compatibility but only works if the enumerator is active.
     */
    EnumeratorBase.prototype.reset = function () {
        var _ = this;
        _.throwIfDisposed();
        var y = _._yielder;
        _._yielder = undefined;
        _._state = 0 /* Before */;
        if (y)
            yielder(y); // recycle until actually needed.
    };
    EnumeratorBase.prototype._assertBadState = function () {
        var _ = this;
        switch (_._state) {
            case 3 /* Faulted */:
                _.throwIfDisposed("This enumerator caused a fault and was disposed.");
                break;
            case 5 /* Disposed */:
                _.throwIfDisposed("This enumerator was manually disposed.");
                break;
        }
    };
    /**
     * Passes the current value to the out callback if the enumerator is active.
     * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
     */
    EnumeratorBase.prototype.tryGetCurrent = function (out) {
        this._assertBadState();
        if (this._state === 1 /* Active */) {
            out(this.current);
            return true;
        }
        return false;
    };
    Object.defineProperty(EnumeratorBase.prototype, "canMoveNext", {
        get: function () {
            return this._state < 2 /* Completed */;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Safely moves to the next entry and returns true if there is one.
     * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
     */
    EnumeratorBase.prototype.moveNext = function () {
        var _ = this;
        _._assertBadState();
        try {
            switch (_._state) {
                case 0 /* Before */:
                    _._yielder = _._yielder || yielder();
                    _._state = 1 /* Active */;
                    var initializer = _._initializer;
                    if (initializer)
                        initializer();
                // fall through
                case 1 /* Active */:
                    if (_._tryGetNext(_._yielder)) {
                        return true;
                    }
                    else {
                        this.dispose();
                        _._state = 2 /* Completed */;
                        return false;
                    }
                default:
                    return false;
            }
        }
        catch (e) {
            this.dispose();
            _._state = 3 /* Faulted */;
            throw e;
        }
    };
    /**
     * Moves to the next entry and emits the value through the out callback.
     * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
     */
    EnumeratorBase.prototype.tryMoveNext = function (out) {
        if (this.moveNext()) {
            out(this.current);
            return true;
        }
        return false;
    };
    EnumeratorBase.prototype.nextValue = function () {
        return this.moveNext()
            ? this.current
            : VOID0;
    };
    /**
     * Exposed for compatibility with generators.
     */
    EnumeratorBase.prototype.next = function () {
        return this.moveNext()
            ? new IteratorResult_1.IteratorResult(this.current, this.index)
            : IteratorResult_1.IteratorResult.Done;
    };
    EnumeratorBase.prototype.end = function () {
        this._ensureDisposeState(4 /* Interrupted */);
    };
    EnumeratorBase.prototype['return'] = function (value) {
        var _ = this;
        _._assertBadState();
        try {
            return value === VOID0 || _._state === 2 /* Completed */ || _._state === 4 /* Interrupted */
                ? IteratorResult_1.IteratorResult.Done
                : new IteratorResult_1.IteratorResult(value, VOID0, true);
        }
        finally {
            _.end();
        }
    };
    EnumeratorBase.prototype._ensureDisposeState = function (state) {
        var _ = this;
        if (!_.wasDisposed) {
            _.dispose();
            _._state = state;
        }
    };
    EnumeratorBase.prototype._onDispose = function () {
        var _ = this;
        _._isEndless = false;
        var disposer = _._disposer;
        _._initializer = null;
        _._disposer = null;
        var y = _._yielder;
        _._yielder = undefined;
        this._state = 5 /* Disposed */;
        if (y)
            yielder(y);
        if (disposer)
            disposer();
    };
    return EnumeratorBase;
}(DisposableBase_1.DisposableBase));
exports.EnumeratorBase = EnumeratorBase;
exports.default = EnumeratorBase;
//# sourceMappingURL=EnumeratorBase.js.map