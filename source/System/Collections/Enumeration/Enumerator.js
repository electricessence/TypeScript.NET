/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", '../../Types', './ArrayEnumerator', './IndexEnumerator'], function (require, exports, Types_1, ArrayEnumerator_1, IndexEnumerator_1) {
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
    })();
    var Empty = new EmptyEnumerator();
    function from(source) {
        if (!source)
            return Empty;
        if (source instanceof Array)
            return new ArrayEnumerator_1.default(source);
        if (typeof source === Types_1.default.OBJECT) {
            if ("length" in source) {
                var a = source;
                return new IndexEnumerator_1.default(function () {
                    return {
                        source: a,
                        length: a.length,
                        pointer: 0,
                        step: 1
                    };
                });
            }
            if ("getEnumerator" in source)
                return source.getEnumerator();
        }
        throw new Error("Unknown enumerable.");
    }
    exports.from = from;
    function forEach(e, action) {
        if (e) {
            var index = 0;
            while (e.moveNext()) {
                if (action(e.current, index++) === false)
                    break;
            }
        }
    }
    exports.forEach = forEach;
});
//# sourceMappingURL=Enumerator.js.map