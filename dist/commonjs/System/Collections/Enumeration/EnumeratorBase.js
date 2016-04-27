/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DisposableBase_1 = require('../../Disposable/DisposableBase');

var Yielder = function () {
    function Yielder() {
        _classCallCheck(this, Yielder);
    }

    _createClass(Yielder, [{
        key: 'yieldReturn',
        value: function yieldReturn(value) {
            this._current = value;
            return true;
        }
    }, {
        key: 'yieldBreak',
        value: function yieldBreak() {
            this._current = null;
            return false;
        }
    }, {
        key: 'current',
        get: function get() {
            return this._current;
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

var EnumeratorBase = function (_DisposableBase_1$def) {
    _inherits(EnumeratorBase, _DisposableBase_1$def);

    function EnumeratorBase(initializer, tryGetNext, disposer) {
        _classCallCheck(this, EnumeratorBase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EnumeratorBase).call(this));

        _this.initializer = initializer;
        _this.tryGetNext = tryGetNext;
        _this.disposer = disposer;
        _this.reset();
        return _this;
    }

    _createClass(EnumeratorBase, [{
        key: 'reset',
        value: function reset() {
            var _ = this;
            _._yielder = new Yielder();
            _._state = EnumeratorState.Before;
        }
    }, {
        key: 'moveNext',
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
        key: '_onDispose',
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
        key: 'current',
        get: function get() {
            return this._yielder.current;
        }
    }]);

    return EnumeratorBase;
}(DisposableBase_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EnumeratorBase;
//# sourceMappingURL=EnumeratorBase.js.map
