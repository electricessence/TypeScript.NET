/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Types_1 = require("../../Types");
var DisposableBase_1 = require("../../Disposable/DisposableBase");
var ObjectPool_1 = require("../../Disposable/ObjectPool");
var IteratorResult_1 = require("./IteratorResult");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;
var VOID0 = void 0;
var yielderPool;
function yielder(recycle) {
    if (!yielderPool) yielderPool = new ObjectPool_1.ObjectPool(40, function () {
        return new Yielder();
    }, function (y) {
        return y.yieldBreak();
    });
    if (!recycle) return yielderPool.take();
    yielderPool.add(recycle);
}

var Yielder = function () {
    function Yielder() {
        _classCallCheck(this, Yielder);

        this._current = VOID0;
    }

    _createClass(Yielder, [{
        key: "yieldReturn",
        value: function yieldReturn(value) {
            this._current = value;
            if (this._index === VOID0) this._index = 0;else this._index++;
            return true;
        }
    }, {
        key: "yieldBreak",
        value: function yieldBreak() {
            this._current = VOID0;
            this._index = VOID0;
            return false;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.yieldBreak();
        }
    }, {
        key: "current",
        get: function get() {
            return this._current;
        }
    }, {
        key: "index",
        get: function get() {
            return this._index;
        }
    }]);

    return Yielder;
}();

var EnumeratorState;
(function (EnumeratorState) {
    EnumeratorState[EnumeratorState["Before"] = 0] = "Before";
    EnumeratorState[EnumeratorState["Running"] = 1] = "Running";
    EnumeratorState[EnumeratorState["After"] = 2] = "After";
})(EnumeratorState || (EnumeratorState = {}));

var EnumeratorBase = function (_DisposableBase_1$Dis) {
    _inherits(EnumeratorBase, _DisposableBase_1$Dis);

    function EnumeratorBase(_initializer, _tryGetNext, disposer, isEndless) {
        _classCallCheck(this, EnumeratorBase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EnumeratorBase).call(this));

        _this._initializer = _initializer;
        _this._tryGetNext = _tryGetNext;
        _this.reset();
        if (Types_1.Type.isBoolean(isEndless)) _this._isEndless = isEndless;else if (Types_1.Type.isBoolean(disposer)) _this._isEndless = disposer;
        if (Types_1.Type.isFunction(disposer)) _this._disposer = disposer;
        return _this;
    }

    _createClass(EnumeratorBase, [{
        key: "reset",
        value: function reset() {
            var _ = this;
            _.throwIfDisposed();
            var y = _._yielder;
            _._yielder = null;
            _._state = EnumeratorState.Before;
            if (y) yielder(y);
        }
    }, {
        key: "moveNext",
        value: function moveNext() {
            var _ = this;
            try {
                switch (_._state) {
                    case EnumeratorState.Before:
                        _._yielder = _._yielder || yielder();
                        _._state = EnumeratorState.Running;
                        var initializer = _._initializer;
                        if (initializer) initializer();
                    case EnumeratorState.Running:
                        if (_._tryGetNext(_._yielder)) {
                            return true;
                        } else {
                            this.dispose();
                            return false;
                        }
                    case EnumeratorState.After:
                        return false;
                }
            } catch (e) {
                this.dispose();
                throw e;
            }
        }
    }, {
        key: "nextValue",
        value: function nextValue() {
            return this.moveNext() ? this.current : VOID0;
        }
    }, {
        key: "next",
        value: function next() {
            return this.moveNext() ? new IteratorResult_1.IteratorResult(this.current, this.index) : IteratorResult_1.IteratorResult.Done;
        }
    }, {
        key: 'return',
        value: function _return(value) {
            try {
                return value === VOID0 || this._state === EnumeratorState.After ? IteratorResult_1.IteratorResult.Done : new IteratorResult_1.IteratorResult(value, VOID0, true);
            } finally {
                this.dispose();
            }
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            var _ = this,
                disposer = _._disposer;
            _._initializer = null;
            _._disposer = null;
            var y = _._yielder;
            _._yielder = null;
            this._state = EnumeratorState.After;
            if (y) yielder(y);
            if (disposer) disposer();
        }
    }, {
        key: "current",
        get: function get() {
            var y = this._yielder;
            return y && y.current;
        }
    }, {
        key: "index",
        get: function get() {
            var y = this._yielder;
            return y && y.index;
        }
    }, {
        key: "isEndless",
        get: function get() {
            return this._isEndless;
        }
    }]);

    return EnumeratorBase;
}(DisposableBase_1.DisposableBase);

exports.EnumeratorBase = EnumeratorBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EnumeratorBase;
//# sourceMappingURL=EnumeratorBase.js.map
