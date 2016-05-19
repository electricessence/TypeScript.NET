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

var Values = require("../../Compare");
var SortContext_1 = require("./SortContext");
var Functions_1 = require("../../Functions");

var KeySortedContext = function (_SortContext_1$SortCo) {
    _inherits(KeySortedContext, _SortContext_1$SortCo);

    function KeySortedContext(next, _keySelector) {
        var order = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
        var comparer = arguments.length <= 3 || arguments[3] === undefined ? Values.compare : arguments[3];

        _classCallCheck(this, KeySortedContext);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KeySortedContext).call(this, next, comparer, order));

        _this._keySelector = _keySelector;
        return _this;
    }

    _createClass(KeySortedContext, [{
        key: "compare",
        value: function compare(a, b) {
            var _ = this,
                ks = _._keySelector;
            if (!ks || ks == Functions_1.Functions.Identity) return _get(Object.getPrototypeOf(KeySortedContext.prototype), "compare", this).call(this, a, b);
            var d = Values.compare(ks(a), ks(b));
            if (d == 0 && _._next) return _._next.compare(a, b);
            return _._order * d;
        }
    }]);

    return KeySortedContext;
}(SortContext_1.SortContext);

exports.KeySortedContext = KeySortedContext;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeySortedContext;
//# sourceMappingURL=KeySortedContext.js.map
