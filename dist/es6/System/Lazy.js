/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ResolverBase } from "./ResolverBase";
export class Lazy extends ResolverBase {
    constructor(valueFactory, trapExceptions = false, allowReset = false) {
        super(valueFactory, trapExceptions, allowReset);
        this._disposableObjectName = 'Lazy';
        this._isValueCreated = false;
    }
    get isValueCreated() {
        return !!this._isValueCreated;
    }
    get value() {
        return this.getValue();
    }
    equals(other) {
        return this == other;
    }
    valueEquals(other) {
        return this.equals(other) || this.value === other.value;
    }
}
export default Lazy;
//# sourceMappingURL=Lazy.js.map