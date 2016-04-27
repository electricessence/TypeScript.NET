/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Types", "./ArrayEnumerator", "./IndexEnumerator"], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var Types_1, ArrayEnumerator_1, IndexEnumerator_1;
    var VOID0, EmptyEnumerator, Empty, empty;
    function from(source) {
        if (!source)
            return Empty;
        if (Array.isArray(source))
            return new ArrayEnumerator_1.default(source);
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
        if (!Types_1.default.isPrimitive(source)) {
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
    function isEnumerableOrArrayLike(instance) {
        return Types_1.default.isArrayLike(instance) || isEnumerable(instance);
    }
    exports_1("isEnumerableOrArrayLike", isEnumerableOrArrayLike);
    function isEnumerator(instance) {
        return Types_1.default.hasMemberOfType(instance, "moveNext", Types_1.default.FUNCTION);
    }
    exports_1("isEnumerator", isEnumerator);
    function forEach(e, action) {
        if (e) {
            if (Types_1.default.isArrayLike(e)) {
                for (var i = 0; i < e.length; i++)
                    if (action(e[i], i) === false)
                        break;
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
            VOID0 = void (0);
            EmptyEnumerator = (function () {
                function EmptyEnumerator() {
                }
                Object.defineProperty(EmptyEnumerator.prototype, "current", {
                    get: function () {
                        return VOID0;
                    },
                    enumerable: true,
                    configurable: true
                });
                EmptyEnumerator.prototype.moveNext = function () {
                    return false;
                };
                EmptyEnumerator.prototype.nextValue = function () {
                    return VOID0;
                };
                EmptyEnumerator.prototype.next = function () {
                    return {
                        value: VOID0,
                        done: true
                    };
                };
                EmptyEnumerator.prototype.reset = function () { };
                EmptyEnumerator.prototype.dispose = function () { };
                return EmptyEnumerator;
            }());
            Empty = new EmptyEnumerator();
            Object.freeze(Empty);
            exports_1("empty", empty = Empty);
        }
    }
});
//# sourceMappingURL=Enumerator.js.map