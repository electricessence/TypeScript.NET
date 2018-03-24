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
        define(["require", "exports", "../../Integer", "./initializeArray"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Integer_1 = require("../../Integer");
    var initializeArray_1 = require("./initializeArray");
    var COUNT = 'count';
    /**
     * Simply repeats a value the number of times specified.
     * @param element
     * @param count
     * @returns {T[]}
     */
    function repeatElement(element, count) {
        Integer_1.default.assertPositive(count, COUNT);
        var result = initializeArray_1.default(count);
        for (var i = 0; i < count; i++)
            result[i] = element;
        return result;
    }
    exports.repeatElement = repeatElement;
});
//# sourceMappingURL=repeatElement.js.map