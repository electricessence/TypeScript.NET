/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimpleEnumerableBase_1 = require("./SimpleEnumerableBase");
var VOID0 = void 0;

var IteratorEnumerator = function (_SimpleEnumerableBase) {
    _inherits(IteratorEnumerator, _SimpleEnumerableBase);

    function IteratorEnumerator(_iterator, _isEndless) {
        _classCallCheck(this, IteratorEnumerator);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IteratorEnumerator).call(this));

        _this._iterator = _iterator;
        _this._isEndless = _isEndless;
        return _this;
    }

    _createClass(IteratorEnumerator, [{
        key: "canMoveNext",
        value: function canMoveNext() {
            return this._iterator != null;
        }
    }, {
        key: "moveNext",
        value: function moveNext(value) {
            var _ = this;
            var i = _._iterator;
            if (i) {
                var r = arguments.length ? i.next(value) : i.next();
                _._current = r.value;
                if (r.done) _.dispose();else return true;
            }
            return false;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            _get(Object.getPrototypeOf(IteratorEnumerator.prototype), "dispose", this).call(this);
            this._iterator = VOID0;
        }
    }, {
        key: "getIsEndless",
        value: function getIsEndless() {
            return this._isEndless && _get(Object.getPrototypeOf(IteratorEnumerator.prototype), "getIsEndless", this).call(this);
        }
    }]);

    return IteratorEnumerator;
}(SimpleEnumerableBase_1.SimpleEnumerableBase);

exports.IteratorEnumerator = IteratorEnumerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IteratorEnumerator;
//# sourceMappingURL=IteratorEnumerator.js.map
