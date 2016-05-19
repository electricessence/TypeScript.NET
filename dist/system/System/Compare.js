/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./Types"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1;
    var isTrueNaN, VOID0, COMPARE_TO;
    function areEqual(a, b, strict) {
        if (strict === void 0) { strict = true; }
        return a === b
            || !strict && a == b
            || isTrueNaN(a) && isTrueNaN(b);
    }
    exports_1("areEqual", areEqual);
    function compare(a, b, strict) {
        if (strict === void 0) { strict = true; }
        if (areEqual(a, b, strict))
            return 0;
        if (a && Types_1.Type.hasMember(a, COMPARE_TO))
            return a.compareTo(b);
        else if (b && Types_1.Type.hasMember(b, COMPARE_TO))
            return -b.compareTo(a);
        if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0))
            return 1;
        if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0))
            return -1;
        return NaN;
    }
    exports_1("compare", compare);
    function areEquivalent(a, b, nullEquivalency, extraDepth) {
        if (nullEquivalency === void 0) { nullEquivalency = true; }
        if (extraDepth === void 0) { extraDepth = 0; }
        if (areEqual(a, b, true))
            return true;
        if (a === null || a === VOID0 || b == null || b === VOID0) {
            if (!nullEquivalency)
                return false;
            if (Types_1.Type.isObject(a)) {
                return !Object.keys(a).length;
            }
            if (Types_1.Type.isObject(b)) {
                return !Object.keys(b).length;
            }
            return (a === null || a === VOID0) && (b == null || b === VOID0);
        }
        if (Types_1.Type.isObject(a) && Types_1.Type.isObject(b)) {
            var aKeys = Object.keys(a), bKeys = Object.keys(b), len = aKeys.length;
            if (len != bKeys.length)
                return false;
            aKeys.sort();
            bKeys.sort();
            for (var i = 0; i < len; i++) {
                var key = aKeys[i];
                if (key !== bKeys[i] || !areEqual(a[key], b[key], true))
                    return false;
            }
            if (extraDepth > 0) {
                for (var _i = 0, aKeys_1 = aKeys; _i < aKeys_1.length; _i++) {
                    var key = aKeys_1[_i];
                    if (!areEquivalent(a[key], b[key], nullEquivalency, extraDepth - 1))
                        return false;
                }
            }
            return true;
        }
        return false;
    }
    exports_1("areEquivalent", areEquivalent);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }],
        execute: function() {
            isTrueNaN = Types_1.Type.isTrueNaN;
            VOID0 = void 0;
            COMPARE_TO = "compareTo";
        }
    }
});
//# sourceMappingURL=Compare.js.map