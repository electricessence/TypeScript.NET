/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../Disposable/dispose", "../../Types", "./ArrayEnumerator", "./IndexEnumerator", "./UnsupportedEnumerableException"], factory);
    }
})(function (require, exports) {
    'use strict';
    var dispose_1 = require("../../Disposable/dispose");
    var Types_1 = require("../../Types");
    var ArrayEnumerator_1 = require("./ArrayEnumerator");
    var IndexEnumerator_1 = require("./IndexEnumerator");
    var UnsupportedEnumerableException_1 = require("./UnsupportedEnumerableException");
    var VOID0 = void (0), STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' +
        'Would result in an infinite loop that could hang the current process.';
    function throwIfEndless(isEndless) {
        if (isEndless)
            throw new UnsupportedEnumerableException_1.default(ENDLESS_EXCEPTION_MESSAGE);
    }
    exports.throwIfEndless = throwIfEndless;
    function initArrayFrom(source) {
        if (Array.isArray(source) || Types_1.default.isString(source)) {
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
    var EmptyEnumerator = (function () {
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
    var Empty = new EmptyEnumerator();
    Object.freeze(Empty);
    exports.empty = Empty;
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
    exports.from = from;
    function isEnumerable(instance) {
        return Types_1.default.hasMemberOfType(instance, "getEnumerator", Types_1.default.FUNCTION);
    }
    exports.isEnumerable = isEnumerable;
    function isEnumerableOrArrayLike(instance) {
        return Types_1.default.isArrayLike(instance) || isEnumerable(instance);
    }
    exports.isEnumerableOrArrayLike = isEnumerableOrArrayLike;
    function isEnumerator(instance) {
        return Types_1.default.hasMemberOfType(instance, "moveNext", Types_1.default.FUNCTION);
    }
    exports.isEnumerator = isEnumerator;
    function forEach(e, action) {
        if (e !== VOID0 && e !== null) {
            if (Types_1.default.isArrayLike(e)) {
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
    exports.forEach = forEach;
    function toArray(source) {
        if (source === STRING_EMPTY)
            return [];
        if (Array.isArray(source))
            return source.slice();
        var result = initArrayFrom(source);
        if (!forEach(source, function (e, i) { result[i] = e; }))
            throw new UnsupportedEnumerableException_1.default();
        return result;
    }
    exports.toArray = toArray;
    function map(source, selector) {
        var result = initArrayFrom(source);
        if (!forEach(source, function (e, i) { result[i] = selector(e); }))
            throw new UnsupportedEnumerableException_1.default();
        return result;
    }
    exports.map = map;
});
//# sourceMappingURL=Enumerator.js.map