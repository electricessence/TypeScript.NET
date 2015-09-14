/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../../Types', './ArrayEnumerator', './IndexEnumerator'], function (require, exports, Types, ArrayEnumerator, IndexEnumerator) {
    'use strict';
    // Statics only...  No constructor...
    var Enumerator;
    (function (Enumerator) {
        // Could be array, or IEnumerable...
        function from(source) {
            if (source instanceof Array)
                return new ArrayEnumerator(source);
            if (typeof source === Types.Object && "length" in source)
                return new IndexEnumerator(function () {
                    return {
                        source: source,
                        length: source.length,
                        pointer: 0,
                        step: 1
                    };
                });
            if ("getEnumerator" in source)
                return source.getEnumerator();
            throw new Error("Unknown enumerable.");
        }
        Enumerator.from = from;
        function forEach(e, action) {
            if (e) {
                var index = 0;
                // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
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