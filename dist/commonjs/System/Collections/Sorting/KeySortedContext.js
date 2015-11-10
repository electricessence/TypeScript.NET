/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Compare = require('../../Compare');

var Values = _interopRequireWildcard(_Compare);

var _SortContext2 = require("./SortContext");

var _SortContext3 = _interopRequireDefault(_SortContext2);

var _Functions = require("../../Functions");

var _Functions2 = _interopRequireDefault(_Functions);

var KeySortedContext = (function (_SortContext) {
    _inherits(KeySortedContext, _SortContext);

    function KeySortedContext(next, _keySelector) {
        var order = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
        var comparer = arguments.length <= 3 || arguments[3] === undefined ? Values.compare : arguments[3];

        _classCallCheck(this, KeySortedContext);

        _get(Object.getPrototypeOf(KeySortedContext.prototype), "constructor", this).call(this, next, comparer, order);
        this._keySelector = _keySelector;
    }

    _createClass(KeySortedContext, [{
        key: "compare",
        value: function compare(a, b) {
            var _ = this,
                ks = _._keySelector;
            if (!ks || ks == _Functions2["default"].Identity) return _get(Object.getPrototypeOf(KeySortedContext.prototype), "compare", this).call(this, a, b);
            var d = Values.compare(ks(a), ks(b));
            if (d == 0 && _._next) return _._next.compare(a, b);
            return _._order * d;
        }
    }]);

    return KeySortedContext;
})(_SortContext3["default"]);

exports["default"] = KeySortedContext;
module.exports = exports["default"];
//# sourceMappingURL=KeySortedContext.js.map
