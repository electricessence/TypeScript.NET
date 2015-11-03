///<reference path="IComparable.d.ts"/>
///<reference path="Primitive.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['./Types'], function(exports_1) {
    var Types_1;
    var isTrueNaN, COMPARE_TO;
    function areEqual(a, b, strict) {
        if (strict === void 0) { strict = true; }
        return a === b || !strict && a == b || isTrueNaN(a) && isTrueNaN(b);
    }
    exports_1("areEqual", areEqual);
    function compare(a, b, strict) {
        if (strict === void 0) { strict = true; }
        if (areEqual(a, b, strict))
            return 0;
        if (a && Types_1.default.hasMember(a, COMPARE_TO))
            return a.compareTo(b);
        else if (b && Types_1.default.hasMember(b, COMPARE_TO))
            return -b.compareTo(a);
        if (a > b || strict && (a === 0 && b == 0 || a === null && b === undefined))
            return 1;
        if (b > a || strict && (b === 0 && a == 0 || b === null && a === undefined))
            return -1;
        return NaN;
    }
    exports_1("compare", compare);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }],
        execute: function() {
            isTrueNaN = Types_1.default.isTrueNaN;
            COMPARE_TO = "compareTo";
        }
    }
});
//# sourceMappingURL=Compare.js.map