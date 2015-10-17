/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _DisposableDisposableBase = require('../../Disposable/DisposableBase');

var _DisposableDisposableBase2 = _interopRequireDefault(_DisposableDisposableBase);

var Yielder = (function () {
    function Yielder() {
        _classCallCheck(this, Yielder);
    }

    _createClass(Yielder, [{
        key: "yieldReturn",
        value: function yieldReturn(value) {
            this._current = value;
            return true;
        }
    }, {
        key: "yieldBreak",
        value: function yieldBreak() {
            this._current = null;
            return false;
        }
    }, {
        key: "current",
        get: function get() {
            return this._current;
        }
    }]);

    return Yielder;
})();

var EnumeratorState;
(function (EnumeratorState) {
    EnumeratorState[EnumeratorState["Before"] = 0] = "Before";
    EnumeratorState[EnumeratorState["Running"] = 1] = "Running";
    EnumeratorState[EnumeratorState["After"] = 2] = "After";
})(EnumeratorState || (EnumeratorState = {}));

var EnumeratorBase = (function (_DisposableBase) {
    _inherits(EnumeratorBase, _DisposableBase);

    function EnumeratorBase(initializer, tryGetNext, disposer) {
        _classCallCheck(this, EnumeratorBase);

        _get(Object.getPrototypeOf(EnumeratorBase.prototype), "constructor", this).call(this);
        this.initializer = initializer;
        this.tryGetNext = tryGetNext;
        this.disposer = disposer;
        this.reset();
    }

    _createClass(EnumeratorBase, [{
        key: "reset",
        value: function reset() {
            var _ = this;
            _._yielder = new Yielder();
            _._state = EnumeratorState.Before;
        }
    }, {
        key: "moveNext",
        value: function moveNext() {
            var _ = this;
            try {
                switch (_._state) {
                    case EnumeratorState.Before:
                        _._state = EnumeratorState.Running;
                        var initializer = _.initializer;
                        if (initializer) initializer();
                    case EnumeratorState.Running:
                        if (_.tryGetNext(_._yielder)) {
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
        key: "_onDispose",
        value: function _onDispose() {
            var _ = this,
                disposer = _.disposer;
            _.initializer = null;
            _.disposer = null;
            var yielder = _._yielder;
            _._yielder = null;
            if (yielder) yielder.yieldBreak();
            try {
                if (disposer) disposer();
            } finally {
                this._state = EnumeratorState.After;
            }
        }
    }, {
        key: "current",
        get: function get() {
            return this._yielder.current;
        }
    }]);

    return EnumeratorBase;
})(_DisposableDisposableBase2["default"]);

exports["default"] = EnumeratorBase;
module.exports = exports["default"];
//# sourceMappingURL=EnumeratorBase.js.map
