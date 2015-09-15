/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", './Types'], function (require, exports, Types) {
    var System;
    (function (System) {
        function isEqualToNaN(n) {
            return typeof n === Types.Number && isNaN(n);
        }
        System.isEqualToNaN = isEqualToNaN;
        function areEqual(a, b, strict) {
            if (strict === void 0) { strict = true; }
            return a === b || !strict && a == b || isEqualToNaN(a) && isEqualToNaN(b);
        }
        System.areEqual = areEqual;
        function compare(a, b, strict) {
            if (strict === void 0) { strict = true; }
            if (areEqual(a, b, strict))
                return 0 | 0;
            if (a > b)
                return (+1) | 0;
            if (b > a)
                return (-1) | 0;
            return NaN;
        }
        System.compare = compare;
        function clone(source, depth) {
            if (depth === void 0) { depth = 0; }
            if (depth < 0)
                return source;
            switch (typeof source) {
                case Types.Undefined:
                case Types.Null:
                case Types.String:
                case Types.Boolean:
                case Types.Number:
                case Types.Function:
                    return source;
            }
            var result;
            if (source instanceof Array) {
                result = source.slice();
                if (depth > 0) {
                    for (var i = 0; i < result.length; i++)
                        if (i in result)
                            result[i] = clone(result[i], depth - 1);
                }
            }
            else {
                result = {};
                if (depth > 0)
                    for (var k in source) {
                        result[k] = clone(source[k], depth - 1);
                    }
            }
            return result;
        }
        System.clone = clone;
        function copyTo(source, target) {
            for (var k in source) {
                target[k] = source[k];
            }
        }
        System.copyTo = copyTo;
        function applyMixins(derivedConstructor, baseConstructors) {
            baseConstructors.forEach(function (bc) {
                Object.getOwnPropertyNames(bc.prototype).forEach(function (name) {
                    derivedConstructor.prototype[name] = bc.prototype[name];
                });
            });
        }
        System.applyMixins = applyMixins;
    })(System || (System = {}));
    return System;
});
//# sourceMappingURL=System.js.map