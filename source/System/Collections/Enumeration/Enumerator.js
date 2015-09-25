/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../../Types', './ArrayEnumerator', './IndexEnumerator'], function (require, exports, Types, ArrayEnumerator, IndexEnumerator) {
    'use strict';
    var Enumerator;
    (function (Enumerator) {
        function from(source) {
            if (source instanceof Array)
                return new ArrayEnumerator(source);
            if (typeof source === Types.Object && "length" in source) {
                var a = source;
                return new IndexEnumerator(function () {
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
            throw new Error("Unknown enumerable.");
        }
        Enumerator.from = from;
        function forEach(e, action) {
            if (e) {
                var index = 0;
                while (e.moveNext()) {
                    if (action(e.current, index++) === false)
                        break;
                }
            }
        }
        Enumerator.forEach = forEach;
    })(Enumerator || (Enumerator = {}));
    return Enumerator;
});
//# sourceMappingURL=Enumerator.js.map