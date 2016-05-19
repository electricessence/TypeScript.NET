/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var valid, ValidationResult;
    return {
        setters:[],
        execute: function() {
            valid = new ValidationResult(true);
            ValidationResult = (function () {
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
            }());
            exports_1("default", ValidationResult);
        }
    }
});
//# sourceMappingURL=ValidationResult.js.map