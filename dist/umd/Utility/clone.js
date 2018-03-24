/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Reflection/isObject", "../Collections/Array/copyArray", "../Reflection/isArrayLike"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isObject_1 = require("../Reflection/isObject");
    var copyArray_1 = require("../Collections/Array/copyArray");
    var isArrayLike_1 = require("../Reflection/isArrayLike");
    function clone(source, depth) {
        if (depth === void 0) { depth = 0; }
        if (depth < 0 || !source || !isObject_1.default(source))
            return source;
        if (isArrayLike_1.default(source)) {
            // Make a copyArray first just in case there's some weird references.
            var result = copyArray_1.default(source);
            if (depth > 0) {
                var len = source.length;
                for (var i = 0; i < len; i++) {
                    result[i] = clone(result[i], depth - 1);
                }
            }
            return result;
        }
        else {
            var result = {};
            if (depth > 0)
                for (var k in source) {
                    //noinspection JSUnfilteredForInLoop
                    result[k] = clone(source[k], depth - 1);
                }
            return result;
        }
    }
    exports.default = clone;
});
//# sourceMappingURL=clone.js.map