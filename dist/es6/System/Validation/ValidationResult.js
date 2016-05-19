/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
const valid = new ValidationResult(true);
export default class ValidationResult {
    constructor(isValid = false, message = null, data = null) {
        this.isValid = isValid;
        this.message = message;
        this.data = data;
        Object.freeze(this);
    }
    equals(other) {
        var _ = this;
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