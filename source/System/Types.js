/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
'use strict';
define(["require", "exports", './Functions'], function (require, exports, Functions) {
    var Types;
    (function (Types) {
        Types.Boolean = typeof true;
        Types.Number = typeof 0;
        Types.String = typeof "";
        Types.Object = typeof {};
        Types.Null = typeof null;
        Types.Undefined = typeof undefined;
        Types.Function = typeof Functions.Blank;
        function isBoolean(type) {
            return typeof type === Types.Boolean;
        }
        Types.isBoolean = isBoolean;
        function isNumber(type) {
            return typeof type === Types.Number;
        }
        Types.isNumber = isNumber;
        function isString(type) {
            return typeof type === Types.String;
        }
        Types.isString = isString;
        function isFunction(type) {
            return typeof type === Types.Function;
        }
        Types.isFunction = isFunction;
    })(Types || (Types = {}));
    Object.freeze(Types);
    return Types;
});
//# sourceMappingURL=Types.js.map