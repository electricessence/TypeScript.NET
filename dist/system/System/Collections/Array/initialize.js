/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Integer"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Initializes an array depending on the requested capacity.
     * The returned array will have a .length equal to the value provided.
     * @param length
     * @returns {T[]}
     */
    function initialize(length) {
        Integer_1.Integer.assert(length, 'length');
        // This logic is based upon JS performance tests that show a significant difference at the level of 65536.
        var array;
        if (length > 65536)
            array = new Array(length);
        else {
            array = [];
            array.length = length;
        }
        return array;
    }
    exports_1("initialize", initialize);
    var Integer_1;
    return {
        setters: [
            function (Integer_1_1) {
                Integer_1 = Integer_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
        }
    };
});
//# sourceMappingURL=initialize.js.map