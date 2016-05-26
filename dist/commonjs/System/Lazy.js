/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResolverBase_1 = require("./ResolverBase");

var Lazy = function (_ResolverBase_1$Resol) {
    _inherits(Lazy, _ResolverBase_1$Resol);

    function Lazy(valueFactory) {
        var trapExceptions = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var allowReset = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        _classCallCheck(this, Lazy);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Lazy).call(this, valueFactory, trapExceptions, allowReset));

        _this._disposableObjectName = 'Lazy';
        _this._isValueCreated = false;
        return _this;
    }

    _createClass(Lazy, [{
        key: "equals",
        value: function equals(other) {
            return this == other;
        }
    }, {
        key: "valueEquals",
        value: function valueEquals(other) {
            return this.equals(other) || this.value === other.value;
        }
    }, {
        key: "isValueCreated",
        get: function get() {
            return !!this._isValueCreated;
        }
    }, {
        key: "value",
        get: function get() {
            return this.getValue();
        }
    }]);

    return Lazy;
}(ResolverBase_1.ResolverBase);

exports.Lazy = Lazy;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Lazy;
//# sourceMappingURL=Lazy.js.map
