/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
export var PropertyKey;
(function (PropertyKey) {
    PropertyKey.typeOfValues = Object.freeze([
        "string" /* String */,
        "number" /* Number */,
        "symbol" /* Symbol */,
    ]);
})(PropertyKey || (PropertyKey = {}));
var keyTypeOfValues = {};
PropertyKey.typeOfValues.forEach(function (v) { return keyTypeOfValues[v] = true; });
/**
 * Returns true if the value is a string, number, or symbol.
 * (Can be used for indexing.)
 * @param value
 * @returns {boolean}
 */
export default function isPropertyKey(value) {
    return keyTypeOfValues[typeof value] || false;
}
//# sourceMappingURL=isPropertyKey.js.map