/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Compare", "../../Types"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Values, Types_1;
    function validateSize(a, b) {
        if (a && b && a === b || !a && !b)
            return true;
        if (!a || !b)
            return false;
        var len = a.length;
        if (len !== b.length)
            return false;
        if (len === 0)
            return true;
        return len;
    }
    function areAllEqual(arrays, strict, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Values.areEqual; }
        if (!arrays)
            throw new Error("ArgumentNullException: 'arrays' cannot be null.");
        if (arrays.length < 2)
            throw new Error("Cannot compare a set of arrays less than 2.");
        var first = arrays[0];
        for (var i = 0, l = arrays.length; i < l; i++) {
            if (!areEqual(first, arrays[i], strict, equalityComparer))
                return false;
        }
        return true;
    }
    exports_1("areAllEqual", areAllEqual);
    function areEqual(a, b, strict, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Values.areEqual; }
        var len = validateSize(a, b);
        if (Types_1.Type.isBoolean(len))
            return len;
        for (var i = 0; i < len; i++) {
            if (!equalityComparer(a[i], b[i], strict))
                return false;
        }
        return true;
    }
    exports_1("areEqual", areEqual);
    function sort(a, comparer) {
        if (!a || a.length < 2)
            return a;
        var len = a.length, b;
        if (len > 65536)
            b = new Array(len);
        else {
            b = [];
            b.length = len;
        }
        for (var i = 0; i < len; i++) {
            b[i] = a[i];
        }
        b.sort(comparer);
        return b;
    }
    function areEquivalent(a, b, comparer) {
        if (comparer === void 0) { comparer = Values.compare; }
        var len = validateSize(a, b);
        if (Types_1.Type.isBoolean(len))
            return len;
        a = sort(a, comparer);
        b = sort(b, comparer);
        for (var i = 0; i < len; i++) {
            if (comparer(a[i], b[i]) !== 0)
                return false;
        }
        return true;
    }
    exports_1("areEquivalent", areEquivalent);
    return {
        setters:[
            function (Values_1) {
                Values = Values_1;
            },
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=Compare.js.map