/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../../Types', './ArrayEnumerator', './IndexEnumerator'], function(exports_1) {
    var Types_1, ArrayEnumerator_1, IndexEnumerator_1;
    var EmptyEnumerator, Empty;
    function from(source) {
        if (!source)
            return Empty;
        if (source instanceof Array)
            return new ArrayEnumerator_1.default(source);
        if (!Types_1.default.isPrimitive(source)) {
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
    exports_1("from", from);
    function forEach(e, action) {
        if (e) {
            var index = 0;
            while (e.moveNext()) {
                if (action(e.current, index++) === false)
                    break;
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
            })();
            Empty = new EmptyEnumerator();
        }
    }
});
//# sourceMappingURL=Enumerator.js.map