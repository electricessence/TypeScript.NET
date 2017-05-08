"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../Types");
var copy_1 = require("../Collections/Array/copy");
function clone(source, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth < 0)
        return source;
    // return primitives as is.
    if (!Types_1.Type.isObject(source))
        return source;
    if (Types_1.Type.isArrayLike(source)) {
        // Make a copy first just in case there's some weird references.
        var result = copy_1.copy(source);
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
//# sourceMappingURL=clone.js.map