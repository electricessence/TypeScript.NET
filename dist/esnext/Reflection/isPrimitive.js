/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
export default function isPrimitive(value, allowUndefined) {
    if (allowUndefined === void 0) { allowUndefined = false; }
    var t = typeof value;
    switch (t) {
        case "boolean" /* Boolean */:
        case "string" /* String */:
        case "number" /* Number */:
            return true;
        case "undefined" /* Undefined */:
            return allowUndefined;
        case "object" /* Object */:
            return value === null;
    }
    return false;
}
//# sourceMappingURL=isPrimitive.js.map