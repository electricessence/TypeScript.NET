/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import isPrimitive from "./isPrimitive";
export default function isPrimitiveOrSymbol(value, allowUndefined) {
    if (allowUndefined === void 0) { allowUndefined = false; }
    return typeof value === "symbol" /* Symbol */ ? true : isPrimitive(value, allowUndefined);
}
//# sourceMappingURL=isPrimitiveOrSymbol.js.map