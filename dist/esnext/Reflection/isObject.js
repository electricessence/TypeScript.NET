/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Returns true if the value parameter is an object.
 * @param value
 * @param allowNull If false (default) null is not considered an object.
 * @returns {boolean}
 */
export default function isObject(value, allowNull) {
    if (allowNull === void 0) { allowNull = false; }
    return typeof value === "object" /* Object */ && (allowNull || value !== null);
}
//# sourceMappingURL=isObject.js.map