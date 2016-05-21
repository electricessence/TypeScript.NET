/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Disposable/dispose", "../../Types", "./ArrayEnumerator", "./IndexEnumerator", "./UnsupportedEnumerableException", "./InfiniteEnumerator", "./EmptyEnumerator", "./IteratorEnumerator"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dispose_1, Types_1, ArrayEnumerator_1, IndexEnumerator_1, UnsupportedEnumerableException_1, InfiniteEnumerator_1, EmptyEnumerator_1, IteratorEnumerator_1;
    var VOID0, STRING_EMPTY, ENDLESS_EXCEPTION_MESSAGE;
    function throwIfEndless(isEndless) {
        if (isEndless)
            throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
    }
    exports_1("throwIfEndless", throwIfEndless);
    function initArrayFrom(source, max) {
        if (max === void 0) { max = Infinity; }
        if (Array.isArray(source) || Types_1.Type.isString(source)) {
            var len = Math.min(source.length, max);
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
            return EmptyEnumerator_1.EmptyEnumerator;
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
            if (Types_1.Type.isFunction(source))
                return new InfiniteEnumerator_1.InfiniteEnumerator(source);
            if (isIterator(source))
                return new IteratorEnumerator_1.IteratorEnumerator(source);
        }
        throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
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
    function isIterator(instance) {
        return Types_1.Type.hasMemberOfType(instance, "next", Types_1.Type.FUNCTION);
    }
    exports_1("isIterator", isIterator);
    function forEach(e, action, max) {
        if (max === void 0) { max = Infinity; }
        if (e === STRING_EMPTY)
            return 0;
        if (e && max > 0) {
            if (Types_1.Type.isArrayLike(e)) {
                throwIfEndless(!isFinite(max) && !isFinite(e.length));
                var i = 0;
                for (; i < Math.min(e.length, max); i++) {
                    if (action(e[i], i) === false)
                        break;
                }
                return i;
            }
            if (isEnumerator(e)) {
                throwIfEndless(!isFinite(max) && e.isEndless);
                var i = 0;
                while (max > i && e.moveNext()) {
                    if (action(e.current, i++) === false)
                        break;
                }
                return i;
            }
            if (isEnumerable(e)) {
                throwIfEndless(!isFinite(max) && e.isEndless);
                return dispose_1.using(e.getEnumerator(), function (f) { return forEach(f, action, max); });
            }
            if (isIterator(e)) {
                throwIfEndless(!isFinite(max));
                var i = 0, r = void 0;
                while (max > i && !(r = e.next()).done) {
                    if (action(r.value, i++) === false)
                        break;
                }
                return i;
            }
        }
        return -1;
    }
    exports_1("forEach", forEach);
    function toArray(source, max) {
        if (max === void 0) { max = Infinity; }
        if (source === STRING_EMPTY)
            return [];
        if (!isFinite(max) && Array.isArray(source))
            return source.slice();
        var result = initArrayFrom(source, max);
        if (-1 === forEach(source, function (e, i) { result[i] = e; }, max))
            throw new UnsupportedEnumerableException_1.UnsupportedEnumerableException();
        return result;
    }
    exports_1("toArray", toArray);
    function map(source, selector, max) {
        if (max === void 0) { max = Infinity; }
        if (source === STRING_EMPTY)
            return [];
        if (!isFinite(max) && Array.isArray(source))
            return source.map(selector);
        var result = initArrayFrom(source, max);
        if (-1 === forEach(source, function (e, i) { result[i] = selector(e); }, max))
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
            },
            function (InfiniteEnumerator_1_1) {
                InfiniteEnumerator_1 = InfiniteEnumerator_1_1;
            },
            function (EmptyEnumerator_1_1) {
                EmptyEnumerator_1 = EmptyEnumerator_1_1;
            },
            function (IteratorEnumerator_1_1) {
                IteratorEnumerator_1 = IteratorEnumerator_1_1;
            }],
        execute: function() {
            VOID0 = void (0), STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' +
                'Would result in an infinite loop that could hang the current process.';
        }
    }
});
//# sourceMappingURL=Enumerator.js.map