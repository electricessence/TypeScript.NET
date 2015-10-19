/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createComparer = createComparer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Types = require('../../Types');

var _Types2 = _interopRequireDefault(_Types);

var _Compare = require('../../Compare');

function ensureArray(value) {
    return value instanceof Array ? value : [value];
}

function createComparer(selector) {
    var order = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var equivalentToNaN = arguments.length <= 2 || arguments[2] === undefined ? NaN : arguments[2];

    var nanHasEquivalent = !_Types2['default'].isTrueNaN(equivalentToNaN);
    return function (a, b) {
        var aValue = ensureArray(selector(a));
        var bValue = ensureArray(selector(b));
        var len = Math.min(aValue.length, bValue.length);
        var oArray = order instanceof Array ? order : null;
        for (var i = 0; i < len; i++) {
            var vA = aValue[i],
                vB = bValue[i],
                o = oArray ? i < oArray.length ? oArray[i] : 1 : order;
            if (nanHasEquivalent) {
                if (_Types2['default'].isTrueNaN(vA)) vA = equivalentToNaN;
                if (_Types2['default'].isTrueNaN(vB)) vB = equivalentToNaN;
            }
            var r = (0, _Compare.compare)(vA, vB);
            if (r !== 0) return o * r;
        }
        return 0;
    };
}

exports['default'] = createComparer;
exports.by = createComparer;
//# sourceMappingURL=Sort.js.map
