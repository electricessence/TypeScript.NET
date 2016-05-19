/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var Types_1 = require("../../Types");
var Compare_1 = require("../../Compare");
function ensureArray(value) {
    return Array.isArray(value) ? value : [value];
}
function createComparer(selector) {
    var order = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var equivalentToNaN = arguments.length <= 2 || arguments[2] === undefined ? NaN : arguments[2];

    var nanHasEquivalent = !Types_1.Type.isTrueNaN(equivalentToNaN);
    return function (a, b) {
        var aValue = ensureArray(selector(a));
        var bValue = ensureArray(selector(b));
        var len = Math.min(aValue.length, bValue.length);
        var oArray = Array.isArray(order) ? order : null;
        for (var i = 0; i < len; i++) {
            var vA = aValue[i],
                vB = bValue[i],
                o = oArray ? i < oArray.length ? oArray[i] : 1 : order;
            if (nanHasEquivalent) {
                if (Types_1.Type.isTrueNaN(vA)) vA = equivalentToNaN;
                if (Types_1.Type.isTrueNaN(vB)) vB = equivalentToNaN;
            }
            var r = Compare_1.compare(vA, vB);
            if (r !== 0) return o * r;
        }
        return 0;
    };
}
exports.createComparer = createComparer;
exports.default = createComparer;
exports.by = createComparer;
//# sourceMappingURL=Sort.js.map
