/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Disposable/dispose", "../../Types", "./ArrayEnumerator", "./IndexEnumerator", "./UnsupportedEnumerableException"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dispose_1, Types_1, ArrayEnumerator_1, IndexEnumerator_1, UnsupportedEnumerableException_1;
    var VOID0, STRING_EMPTY, ENDLESS_EXCEPTION_MESSAGE, EmptyEnumerator, Empty, empty;
    function throwIfEndless(isEndless) {
        if (isEndless)
            throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
    }
    exports_1("throwIfEndless", throwIfEndless);
    function initArrayFrom(source) {
        if (Array.isArray(source) || Types_1.Type.isString(source)) {
            var len = source.length;
            if (isFinite(len)) {
                if (len > 65535)
                    return new Array(len);
                var result = [];
                result.length = len;
                return result;
            }
        }
        return [];
    }
    function from(source) {
        if (!source)
            return Empty;
        if (Array.isArray(source))
            return new ArrayEnumerator_1.ArrayEnumerator(source);
        if (Types_1.Type.isArrayLike(source)) {
            return new IndexEnumerator_1.IndexEnumerator(function () {
                return {
                    source: source,
                    length: source.length,
                    pointer: 0,
                    step: 1
                };
            });
        }
        if (!Types_1.Type.isPrimitive(source)) {
            if (isEnumerable(source))
                return source.getEnumerator();
        }
        throw new Error("Unknown enumerable.");
    }
    exports_1("from", from);
    function isEnumerable(instance) {
        return Types_1.Type.hasMemberOfType(instance, "getEnumerator", Types_1.Type.FUNCTION);
    }
    exports_1("isEnumerable", isEnumerable);
    function isEnumerableOrArrayLike(instance) {
        return Types_1.Type.isArrayLike(instance) || isEnumerable(instance);
    }
    exports_1("isEnumerableOrArrayLike", isEnumerableOrArrayLike);
    function isEnumerator(instance) {
        return Types_1.Type.hasMemberOfType(instance, "moveNext", Types_1.Type.FUNCTION);
    }
    exports_1("isEnumerator", isEnumerator);
    function forEach(e, action) {
        if (e !== VOID0 && e !== null) {
            if (Types_1.Type.isArrayLike(e)) {
                throwIfEndless(!isFinite(e.length));
                for (var i = 0; i < e.length; i++) {
                    if (action(e[i], i) === false)
                        break;
                }
                return true;
            }
            if (isEnumerator(e)) {
                throwIfEndless(e.isEndless);
                var index = 0;
                while (e.moveNext()) {
                    if (action(e.current, index++) === false)
                        break;
                }
                return true;
            }
            if (isEnumerable(e)) {
                throwIfEndless(e.isEndless);
                dispose_1.using(e.getEnumerator(), function (f) { return forEach(f, action); });
                return true;
            }
            return false;
        }
    }
    exports_1("forEach", forEach);
    function toArray(source) {
        if (source === STRING_EMPTY)
            return [];
        if (Array.isArray(source))
            return source.slice();
        var result = initArrayFrom(source);
        if (!forEach(source, function (e, i) { result[i] = e; }))
            throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
        return result;
    }
    exports_1("toArray", toArray);
    function map(source, selector) {
        var result = initArrayFrom(source);
        if (!forEach(source, function (e, i) { result[i] = selector(e); }))
            throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
        return result;
    }
    exports_1("map", map);
    return {
        setters:[
            function (dispose_1_1) {
                dispose_1 = dispose_1_1;
            },
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (ArrayEnumerator_1_1) {
                ArrayEnumerator_1 = ArrayEnumerator_1_1;
            },
            function (IndexEnumerator_1_1) {
                IndexEnumerator_1 = IndexEnumerator_1_1;
            },
            function (UnsupportedEnumerableException_1_1) {
                UnsupportedEnumerableException_1 = UnsupportedEnumerableException_1_1;
            }],
        execute: function() {
            VOID0 = void (0), STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' +
                'Would result in an infinite loop that could hang the current process.';
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
                Object.defineProperty(EmptyEnumerator.prototype, "isEndless", {
                    get: function () {
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                return EmptyEnumerator;
            }());
            Empty = new EmptyEnumerator();
            Object.freeze(Empty);
            exports_1("empty", empty = Empty);
        }
    }
});
//# sourceMappingURL=Enumerator.js.map