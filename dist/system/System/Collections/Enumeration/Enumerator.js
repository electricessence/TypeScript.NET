/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../../Types', './ArrayEnumerator', './IndexEnumerator'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var Types_1, ArrayEnumerator_1, IndexEnumerator_1;
    var EmptyEnumerator, Empty;
    function from(source) {
        if (!source)
            return Empty;
        if (Array.isArray(source))
            return new ArrayEnumerator_1.default(source);
        if (!Types_1.default.isPrimitive(source)) {
            if (Types_1.default.isArrayLike(source)) {
                return new IndexEnumerator_1.default(function () {
                    return {
                        source: source,
                        length: source.length,
                        pointer: 0,
                        step: 1
                    };
                });
            }
            if (isEnumerable(source))
                return source.getEnumerator();
        }
        throw new Error("Unknown enumerable.");
    }
    exports_1("from", from);
    function isEnumerable(instance) {
        return Types_1.default.hasMemberOfType(instance, "getEnumerator", Types_1.default.FUNCTION);
    }
    exports_1("isEnumerable", isEnumerable);
    function isEnumerator(instance) {
        return Types_1.default.hasMemberOfType(instance, "moveNext", Types_1.default.FUNCTION);
    }
    exports_1("isEnumerator", isEnumerator);
    function forEach(e, action) {
        if (e) {
            if (Array.isArray(e)) {
                e.forEach(action);
                return;
            }
            if (isEnumerable(e)) {
                e = e.getEnumerator();
            }
            if (isEnumerator(e)) {
                var index = 0;
                while (e.moveNext()) {
                    if (action(e.current, index++) === false)
                        break;
                }
            }
        }
    }
    exports_1("forEach", forEach);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (ArrayEnumerator_1_1) {
                ArrayEnumerator_1 = ArrayEnumerator_1_1;
            },
            function (IndexEnumerator_1_1) {
                IndexEnumerator_1 = IndexEnumerator_1_1;
            }],
        execute: function() {
            EmptyEnumerator = (function () {
                function EmptyEnumerator() {
                }
                Object.defineProperty(EmptyEnumerator.prototype, "current", {
                    get: function () {
                        return undefined;
                    },
                    enumerable: true,
                    configurable: true
                });
                EmptyEnumerator.prototype.moveNext = function () {
                    return false;
                };
                EmptyEnumerator.prototype.reset = function () { };
                EmptyEnumerator.prototype.dispose = function () { };
                return EmptyEnumerator;
            }());
            Empty = new EmptyEnumerator();
        }
    }
});
//# sourceMappingURL=Enumerator.js.map