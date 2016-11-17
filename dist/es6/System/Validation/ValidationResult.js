const valid = new ValidationResult(true);
export default class ValidationResult {
    constructor(isValid = false, message, data = null) {
        this.isValid = isValid;
        this.message = message;
        this.data = data;
        this.isValid = isValid;
        this.message = message;
        this.data = data;
        Object.freeze(this);
    }
    equals(other) {
        const _ = this;
        return _.isValid === other.isValid
            && _.message == _.message
            && _.data == _.data;
    }
    static get valid() {
        return valid;
    }
    static invalid(message, data = null) {
        return new ValidationResult(false, message, data);
    }
}
//# sourceMappingURL=ValidationResult.js.map