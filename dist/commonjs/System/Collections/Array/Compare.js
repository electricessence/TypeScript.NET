/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.areAllEqual = areAllEqual;
exports.areEqual = areEqual;
exports.areEquivalent = areEquivalent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _Compare = require('../../Compare');

var Values = _interopRequireWildcard(_Compare);

var _Types = require('../../Types');

var _Types2 = _interopRequireDefault(_Types);

function validateSize(a, b) {
    if (a && b && a === b || !a && !b) return true;
    if (!a || !b) return false;
    var len = a.length;
    if (len !== b.length) return false;
    if (len === 0) return true;
    return len;
}

function areAllEqual(arrays, strict) {
    var equalityComparer = arguments.length <= 2 || arguments[2] === undefined ? Values.areEqual : arguments[2];

    if (!arrays) throw new Error("ArgumentNullException: 'arrays' cannot be null.");
    if (arrays.length < 2) throw new Error("Cannot compare a set of arrays less than 2.");
    var first = arrays[0];
    for (var i = 0, l = arrays.length; i < l; ++i) {
        if (!areEqual(first, arrays[i], strict, equalityComparer)) return false;
    }
    return true;
}

function areEqual(a, b, strict) {
    var equalityComparer = arguments.length <= 3 || arguments[3] === undefined ? Values.areEqual : arguments[3];

    var len = validateSize(a, b);
    if (_Types2['default'].isBoolean(len)) return len;
    for (var i = 0; i < len; ++i) {
        if (!equalityComparer(a[i], b[i], strict)) return false;
    }
    return true;
}

function copyAndSort(a, comparer) {
    if (!a) return null;
    if (a instanceof Array) return a.slice();
    var len = a.length,
        b;
    if (len > 65536) b = new Array(len);else {
        b = [];
        b.length = len;
    }
    for (var i = 0; i < len; i++) {
        b[i] = a[i];
    }b.sort(comparer);
    return b;
}

function areEquivalent(a, b) {
    var comparer = arguments.length <= 2 || arguments[2] === undefined ? Values.compare : arguments[2];

    var len = validateSize(a, b);
    if (_Types2['default'].isBoolean(len)) return len;
    a = copyAndSort(a, comparer);
    b = copyAndSort(b, comparer);
    for (var i = 0; i < len; ++i) {
        if (comparer(a[i], b[i]) !== 0) return false;
    }
    return true;
}
//# sourceMappingURL=Compare.js.map
