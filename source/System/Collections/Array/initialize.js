(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "../../Integer"], function (require, exports) {
    "use strict";
    /*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
    var Integer_1 = require("../../Integer");
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
    exports.initialize = initialize;
});
//# sourceMappingURL=initialize.js.map