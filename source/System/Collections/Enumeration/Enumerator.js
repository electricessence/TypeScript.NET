/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../Types', './ArrayEnumerator', './IndexEnumerator'], factory);
    }
})(function (require, exports) {
    'use strict';
    var Types_1 = require('../../Types');
    var ArrayEnumerator_1 = require('./ArrayEnumerator');
    var IndexEnumerator_1 = require('./IndexEnumerator');
    var EmptyEnumerator = (function () {
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
    var Empty = new EmptyEnumerator();
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
    exports.from = from;
    function isEnumerable(instance) {
        return Types_1.default.hasMemberOfType(instance, "getEnumerator", Types_1.default.FUNCTION);
    }
    exports.isEnumerable = isEnumerable;
    function isEnumerator(instance) {
        return Types_1.default.hasMemberOfType(instance, "moveNext", Types_1.default.FUNCTION);
    }
    exports.isEnumerator = isEnumerator;
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
    exports.forEach = forEach;
});
//# sourceMappingURL=Enumerator.js.map