/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
var Functions = require('./Functions');
var Types;
(function (Types) {
    Types.Boolean = typeof true;
    Types.Number = typeof 0;
    Types.String = typeof "";
    Types.Object = typeof {};
    Types.Null = typeof null;
    Types.Undefined = typeof undefined;
    Types.Function = typeof Functions.Blank;
    function isBoolean(value) {
        return typeof value === Types.Boolean;
    }
    Types.isBoolean = isBoolean;
    function isNumber(value) {
        return typeof value === Types.Number;
    }
    Types.isNumber = isNumber;
    function isTrueNaN(value) {
        return typeof value === Types.Number && isNaN(value);
    }
    Types.isTrueNaN = isTrueNaN;
    function isString(value) {
        return typeof value === Types.String;
    }
    Types.isString = isString;
    function isFunction(value) {
        return typeof value === Types.Function;
    }
    Types.isFunction = isFunction;
})(Types || (Types = {}));
Object.freeze(Types);
module.exports = Types;
