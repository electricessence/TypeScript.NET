/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports"], function (require, exports) {
    /// <reference path="IValidationResult.d.ts"/>
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
    return ValidationResult;
});
//# sourceMappingURL=ValidationResult.js.map