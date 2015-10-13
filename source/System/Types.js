/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports"], function (require, exports) {
    var _BOOLEAN = typeof true, _NUMBER = typeof 0, _STRING = typeof "", _OBJECT = typeof {}, _NULL = typeof null, _UNDEFINED = typeof undefined, _FUNCTION = typeof function () { };
    var Types;
    (function (Types) {
        Types.BOOLEAN = _BOOLEAN;
        Types.NUMBER = _NUMBER;
        Types.STRING = _STRING;
        Types.OBJECT = _OBJECT;
        Types.NULL = _NULL;
        Types.UNDEFINED = _UNDEFINED;
        Types.FUNCTION = _FUNCTION;
        function isBoolean(value) {
            return typeof value === _BOOLEAN;
        }
        Types.isBoolean = isBoolean;
        function isNumber(value, allowNaN) {
            if (allowNaN === void 0) { allowNaN = true; }
            return typeof value === _NUMBER && (allowNaN || !isNaN(value));
        }
        Types.isNumber = isNumber;
        function isTrueNaN(value) {
            return typeof value === _NUMBER && isNaN(value);
        }
        Types.isTrueNaN = isTrueNaN;
        function isString(value) {
            return typeof value === _STRING;
        }
        Types.isString = isString;
        function isFunction(value) {
            return typeof value === _FUNCTION;
        }
        Types.isFunction = isFunction;
        function isObject(value) {
            return typeof value === _OBJECT;
        }
        Types.isObject = isObject;
    })(Types = exports.Types || (exports.Types = {}));
    Object.freeze(Types);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Types;
});
//# sourceMappingURL=Types.js.map