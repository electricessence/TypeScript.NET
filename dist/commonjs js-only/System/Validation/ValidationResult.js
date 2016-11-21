"use strict";
var valid = new ValidationResult(true);
/**
 * A class for generating responses to validation.
 */
var ValidationResult = (function () {
    /**
     * Allows for rare cases that ValidationResult.valid and ValidationResult.invalid() don't cover.
     */
    function ValidationResult(isValid, message, data) {
        if (isValid === void 0) { isValid = false; }
        if (data === void 0) { data = null; }
        this.isValid = isValid;
        this.message = message;
        this.data = data;
        this.isValid = isValid;
        this.message = message;
        this.data = data;
        // Readonly...
        Object.freeze(this);
    }
    /**
     * Allows for comparing another IValidationResult to see if they are equal.
     */
    ValidationResult.prototype.equals = function (other) {
        var _ = this;
        return _.isValid === other.isValid
            && _.message == _.message
            && _.data == _.data;
    };
    Object.defineProperty(ValidationResult, "valid", {
        /**
         * Represents a single/shared instance of a valid result.
         * Allows for returning this instance like you would return 'true'.
         */
        get: function () {
            return valid;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Factory method for easily creating an invalid result.
     */
    ValidationResult.invalid = function (message, data) {
        if (data === void 0) { data = null; }
        return new ValidationResult(false, message, data);
    };
    return ValidationResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValidationResult;