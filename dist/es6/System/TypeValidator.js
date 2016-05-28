/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { TypeInfo } from "./Types";
import { areEqual } from "./Compare";
export class TypeInfoHelper extends TypeInfo {
    constructor(value) {
        super(value, () => this._value = value);
    }
    contains(descriptor) {
        let value = this._value;
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
        if (this.type != typeof descriptor || this.isPrimitive && !areEqual(value, descriptor))
            return false;
        if (this.isArray && Array.isArray(descriptor)) {
            let max = Math.min(descriptor.length, value.length);
            for (let i = 0; i < max; i++) {
                if (areInvalid(value[i], descriptor[i]))
                    return false;
            }
            return true;
        }
        if (this.isObject) {
            let targetKeys = Object.keys(value);
            let dKeys = Object.keys(descriptor);
            if (dKeys.length > targetKeys.length)
                return false;
            for (let key of dKeys) {
                if (targetKeys.indexOf(key) == -1)
                    return false;
            }
            for (let key of dKeys) {
                if (areInvalid(value[key], descriptor[key]))
                    return false;
            }
        }
        return true;
    }
}
function areInvalid(v, d) {
    if (!areEqual(v, d)) {
        let memberType = new TypeInfoHelper(v);
        if (!memberType.contains(d))
            return true;
    }
    return false;
}
export class TypeValidator {
    constructor(_typeDescriptor) {
        this._typeDescriptor = _typeDescriptor;
        Object.freeze(this);
    }
    isSubsetOf(o) {
        var t = new TypeInfoHelper(o);
        return t.contains(this._typeDescriptor);
    }
}
export default TypeValidator;
//# sourceMappingURL=TypeValidator.js.map