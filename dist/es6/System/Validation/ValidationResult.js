const valid = new ValidationResult(true);
/**
 * A class for generating responses to validation.
 */
export default class ValidationResult {
    /**
     * Allows for rare cases that ValidationResult.valid and ValidationResult.invalid() don't cover.
     */
    constructor(isValid = false, message, data = null) {
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
    equals(other) {
        const _ = this;
        return _.isValid === other.isValid
            && _.message == _.message
            && _.data == _.data;
    }
    /**
     * Represents a single/shared instance of a valid result.
     * Allows for returning this instance like you would return 'true'.
     */
    static get valid() {
        return valid;
    }
    /**
     * Factory method for easily creating an invalid result.
     */
    static invalid(message, data = null) {
        return new ValidationResult(false, message, data);
    }
}
//# sourceMappingURL=ValidationResult.js.map