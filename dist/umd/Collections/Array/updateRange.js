/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../Exceptions/ArgumentOutOfRangeException", "../../Integer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArgumentOutOfRangeException_1 = require("../../Exceptions/ArgumentOutOfRangeException");
    var Integer_1 = require("../../Integer");
    /**
     * Replaces values of an array across a range of indexes.
     * @param array
     * @param value
     * @param start
     * @param stop
     */
    function updateRange(array, value, start, stop) {
        if (start === void 0) { start = 0; }
        if (!array)
            return;
        Integer_1.default.assertZeroOrGreater(start, 'start');
        if (!stop && stop !== 0)
            stop = array.length;
        Integer_1.default.assert(stop, 'stop');
        if (stop < start)
            throw new ArgumentOutOfRangeException_1.default("stop", stop, "is less than start");
        for (var i = start; i < stop; i++) {
            array[i] = value;
        }
    }
    exports.default = updateRange;
});
//# sourceMappingURL=updateRange.js.map