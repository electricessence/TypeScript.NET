/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
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
        define(["require", "exports", "../../Types", "../../Disposable/DisposableBase", "../../Disposable/ObjectPool"], factory);
    }
})(function (require, exports) {
    'use strict';
    var Types_1 = require("../../Types");
    var DisposableBase_1 = require("../../Disposable/DisposableBase");
    var ObjectPool_1 = require("../../Disposable/ObjectPool");
    var VOID0 = void (0);
    var yielderPool;
    function yielder(recycle) {
        if (!yielderPool)
            yielderPool
                = new ObjectPool_1.default(40, function () { return new Yielder(); });
        if (!recycle)
            return yielderPool.take();
        recycle.yieldBreak();
        yielderPool.add(recycle);
    }
    var Yielder = (function () {
        function Yielder() {
            this._current = VOID0;
        }
        Object.defineProperty(Yielder.prototype, "current", {
            get: function () { return this._current; },
            enumerable: true,
            configurable: true
        });
        Yielder.prototype.yieldReturn = function (value) {
            this._current = value;
            return true;
        };
        Yielder.prototype.yieldBreak = function () {
            this._current = VOID0;
            return false;
        };
        Yielder.prototype.dispose = function () {
            this.yieldBreak();
        };
        return Yielder;
    }());
    var EnumeratorState;
    (function (EnumeratorState) {
        EnumeratorState[EnumeratorState["Before"] = 0] = "Before";
        EnumeratorState[EnumeratorState["Running"] = 1] = "Running";
        EnumeratorState[EnumeratorState["After"] = 2] = "After";
    })(EnumeratorState || (EnumeratorState = {}));
    var EnumeratorBase = (function (_super) {
        __extends(EnumeratorBase, _super);
        function EnumeratorBase(_initializer, _tryGetNext, disposer, isEndless) {
            _super.call(this);
            this._initializer = _initializer;
            this._tryGetNext = _tryGetNext;
            this.reset();
            if (Types_1.default.isBoolean(isEndless))
                this._isEndless = isEndless;
            else if (Types_1.default.isBoolean(disposer))
                this._isEndless = disposer;
        }
        Object.defineProperty(EnumeratorBase.prototype, "current", {
            get: function () {
                return this._yielder.current;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnumeratorBase.prototype, "isEndless", {
            get: function () {
                return this._isEndless;
            },
            enumerable: true,
            configurable: true
        });
        EnumeratorBase.prototype.reset = function () {
            var _ = this;
            _.throwIfDisposed();
            var y = _._yielder;
            if (y)
                y.yieldBreak();
            else
                _._yielder = yielder();
            _._state = EnumeratorState.Before;
        };
        EnumeratorBase.prototype.moveNext = function () {
            var _ = this;
            try {
                switch (_._state) {
                    case EnumeratorState.Before:
                        _._state = EnumeratorState.Running;
                        var initializer = _._initializer;
                        if (initializer)
                            initializer();
                    case EnumeratorState.Running:
                        if (_._tryGetNext(_._yielder)) {
                            return true;
                        }
                        else {
                            this.dispose();
                            return false;
                        }
                    case EnumeratorState.After:
                        return false;
                }
            }
            catch (e) {
                this.dispose();
                throw e;
            }
        };
        EnumeratorBase.prototype.nextValue = function () {
            return this.moveNext()
                ? this._yielder.current
                : VOID0;
        };
        EnumeratorBase.prototype.next = function () {
            return this.moveNext() ?
                {
                    value: this._yielder.current,
                    done: false
                } : {
                value: VOID0,
                done: true
            };
        };
        EnumeratorBase.prototype._onDispose = function () {
            var _ = this, disposer = _._disposer;
            _._initializer = null;
            _._disposer = null;
            var y = _._yielder;
            _._yielder = null;
            yielder(y);
            try {
                if (disposer)
                    disposer();
            }
            finally {
                this._state = EnumeratorState.After;
            }
        };
        return EnumeratorBase;
    }(DisposableBase_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EnumeratorBase;
});
//# sourceMappingURL=EnumeratorBase.js.map