/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
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
        define(["require", "exports", "./Types", "./Collections/Array/Compare"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("./Types");
    var Compare_1 = require("./Collections/Array/Compare");
    var TypeValidator = (function (_super) {
        __extends(TypeValidator, _super);
        function TypeValidator(value) {
            var _this = this;
            _super.call(this, value, function () { return _this._value = value; });
        }
        TypeValidator.prototype.contains = function (descriptor) {
            var value = this._value;
            if (value === descriptor)
                return true;
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
            if (this.type != typeof descriptor)
                return false;
            if (this.isArray && Array.isArray(descriptor)) {
                return true;
            }
            if (this.isObject) {
                var targetKeys = Object.keys(value);
                var dKeys = Object.keys(descriptor);
                if (dKeys.length > targetKeys.length)
                    return false;
                for (var _i = 0, dKeys_1 = dKeys; _i < dKeys_1.length; _i++) {
                    var key = dKeys_1[_i];
                    if (targetKeys.indexOf(key) == -1)
                        return false;
                }
                for (var _a = 0, dKeys_2 = dKeys; _a < dKeys_2.length; _a++) {
                    var key = dKeys_2[_a];
                    var v = value[key], d = descriptor[key];
                    if (Compare_1.areEqual(v, d))
                        continue;
                    var memberType = new TypeValidator(value[key]);
                    if (!memberType.contains(descriptor[key]))
                        return false;
                }
            }
            return true;
        };
        return TypeValidator;
    }(Types_1.TypeInfo));
    exports.TypeValidator = TypeValidator;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TypeValidator;
});
//# sourceMappingURL=TypeValidator.js.map