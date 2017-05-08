/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    function shuffle(target) {
        var i = target.length;
        while (--i) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = target[i];
            target[i] = target[j];
            target[j] = temp;
        }
        return target;
    }
    exports_1("shuffle", shuffle);
    return {
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
        }
    };
});
//# sourceMappingURL=shuffle.js.map