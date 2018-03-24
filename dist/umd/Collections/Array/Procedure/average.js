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
        define(["require", "exports", "./AverageResult"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AverageResult_1 = require("./AverageResult");
    function average(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        return new AverageResult_1.default(source, ignoreNaN).average;
    }
    exports.average = average;
});
//# sourceMappingURL=average.js.map