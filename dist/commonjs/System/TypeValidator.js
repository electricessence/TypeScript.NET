/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Types_1 = require("./Types");
var Compare_1 = require("./Compare");
var extends_1 = require("../extends");
var __extends = extends_1.default;

var TypeInfoHelper = function (_Types_1$TypeInfo) {
    _inherits(TypeInfoHelper, _Types_1$TypeInfo);

    function TypeInfoHelper(value) {
        var _this;

        _classCallCheck(this, TypeInfoHelper);

        return _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TypeInfoHelper).call(this, value, function () {
            return _this._value = value;
        }));
    }

    _createClass(TypeInfoHelper, [{
        key: "contains",
        value: function contains(descriptor) {
            var value = this._value;
            if (value === descriptor) return true;
            switch (descriptor) {
                case Function:
                    return this.isFunction;
                case Object:
                    return this.isObject;
                case Array:
                    return this.isArray;
                case String:
                    return this.isString;
                case Number:
                    return this.isNumber;
                case Boolean:
                    return this.isBoolean;
            }
            if (this.type != (typeof descriptor === "undefined" ? "undefined" : _typeof(descriptor)) || this.isPrimitive && !Compare_1.areEqual(value, descriptor)) return false;
            if (this.isArray && Array.isArray(descriptor)) {
                var max = Math.min(descriptor.length, value.length);
                for (var i = 0; i < max; i++) {
                    if (areInvalid(value[i], descriptor[i])) return false;
                }
                return true;
            }
            if (this.isObject) {
                var targetKeys = Object.keys(value);
                var dKeys = Object.keys(descriptor);
                if (dKeys.length > targetKeys.length) return false;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = dKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var key = _step.value;

                        if (targetKeys.indexOf(key) == -1) return false;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = dKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _key = _step2.value;

                        if (areInvalid(value[_key], descriptor[_key])) return false;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            return true;
        }
    }]);

    return TypeInfoHelper;
}(Types_1.TypeInfo);

exports.TypeInfoHelper = TypeInfoHelper;
function areInvalid(v, d) {
    if (!Compare_1.areEqual(v, d)) {
        var memberType = new TypeInfoHelper(v);
        if (!memberType.contains(d)) return true;
    }
    return false;
}

var TypeValidator = function () {
    function TypeValidator(_typeDescriptor) {
        _classCallCheck(this, TypeValidator);

        this._typeDescriptor = _typeDescriptor;
        Object.freeze(this);
    }

    _createClass(TypeValidator, [{
        key: "isSubsetOf",
        value: function isSubsetOf(o) {
            var t = new TypeInfoHelper(o);
            return t.contains(this._typeDescriptor);
        }
    }]);

    return TypeValidator;
}();

exports.TypeValidator = TypeValidator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeValidator;
//# sourceMappingURL=TypeValidator.js.map
