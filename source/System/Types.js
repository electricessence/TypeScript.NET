/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports"], function (require, exports) {
    var _BOOLEAN = typeof true, _NUMBER = typeof 0, _STRING = typeof "", _OBJECT = typeof {}, _NULL = typeof null, _UNDEFINED = typeof undefined, _FUNCTION = typeof isFunction;
    exports.BOOLEAN = _BOOLEAN;
    exports.NUMBER = _NUMBER;
    exports.STRING = _STRING;
    exports.OBJECT = _OBJECT;
    exports.NULL = _NULL;
    exports.UNDEFINED = _UNDEFINED;
    exports.FUNCTION = _FUNCTION;
    function isBoolean(value) {
        return typeof value === _BOOLEAN;
    }
    exports.isBoolean = isBoolean;
    function isNumber(value, allowNaN) {
        if (allowNaN === void 0) { allowNaN = true; }
        return typeof value === _NUMBER && (allowNaN || !isNaN(value));
    }
    exports.isNumber = isNumber;
    function isTrueNaN(value) {
        return typeof value === _NUMBER && isNaN(value);
    }
    exports.isTrueNaN = isTrueNaN;
    function isString(value) {
        return typeof value === _STRING;
    }
    exports.isString = isString;
    function isFunction(value) {
        return typeof value === _FUNCTION;
    }
    exports.isFunction = isFunction;
});
//# sourceMappingURL=Types.js.map