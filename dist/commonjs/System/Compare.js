/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var Types_1 = require("./Types");
var isTrueNaN = Types_1.Type.isTrueNaN;
var VOID0 = void 0;
function areEqual(a, b) {
    var strict = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    return a === b || !strict && a == b || isTrueNaN(a) && isTrueNaN(b);
}
exports.areEqual = areEqual;
var COMPARE_TO = "compareTo";
function compare(a, b) {
    var strict = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    if (areEqual(a, b, strict)) return 0;
    if (a && Types_1.Type.hasMember(a, COMPARE_TO)) return a.compareTo(b);else if (b && Types_1.Type.hasMember(b, COMPARE_TO)) return -b.compareTo(a);
    if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0)) return 1;
    if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0)) return -1;
    return NaN;
}
exports.compare = compare;
function areEquivalent(a, b) {
    var nullEquivalency = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
    var extraDepth = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    if (areEqual(a, b, true)) return true;
    if (a === null || a === VOID0 || b == null || b === VOID0) {
        if (!nullEquivalency) return false;
        if (Types_1.Type.isObject(a)) {
            return !Object.keys(a).length;
        }
        if (Types_1.Type.isObject(b)) {
            return !Object.keys(b).length;
        }
        return (a === null || a === VOID0) && (b == null || b === VOID0);
    }
    if (Types_1.Type.isObject(a) && Types_1.Type.isObject(b)) {
        var aKeys = Object.keys(a),
            bKeys = Object.keys(b),
            len = aKeys.length;
        if (len != bKeys.length) return false;
        aKeys.sort();
        bKeys.sort();
        for (var i = 0; i < len; i++) {
            var key = aKeys[i];
            if (key !== bKeys[i] || !areEqual(a[key], b[key], true)) return false;
        }
        if (extraDepth > 0) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = aKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _key = _step.value;

                    if (!areEquivalent(a[_key], b[_key], nullEquivalency, extraDepth - 1)) return false;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        return true;
    }
    return false;
}
exports.areEquivalent = areEquivalent;
//# sourceMappingURL=Compare.js.map
