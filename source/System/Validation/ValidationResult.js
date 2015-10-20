/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    /// <reference path="IValidationResult.d.ts"/>
    ///<reference path="../IEquatable.d.ts"/>
    var valid = new ValidationResult(true);
    var ValidationResult = (function () {
        function ValidationResult(isValid, message, data) {
            if (isValid === void 0) { isValid = false; }
            if (message === void 0) { message = null; }
            if (data === void 0) { data = null; }
            this.isValid = isValid;
            this.message = message;
            this.data = data;
            Object.freeze(this);
        }
        ValidationResult.prototype.equals = function (other) {
            var _ = this;
            return _.isValid === other.isValid
                && _.message == _.message
                && _.data == _.data;
        };
        Object.defineProperty(ValidationResult, "valid", {
            get: function () {
                return valid;
            },
            enumerable: true,
            configurable: true
        });
        ValidationResult.invalid = function (message, data) {
            if (data === void 0) { data = null; }
            return new ValidationResult(false, message, data);
        };
        return ValidationResult;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ValidationResult;
});
//# sourceMappingURL=ValidationResult.js.map