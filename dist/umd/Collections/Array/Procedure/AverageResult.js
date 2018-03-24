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
        define(["require", "exports", "tslib", "./SumResult"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var SumResult_1 = require("./SumResult");
    var AverageResult = /** @class */ (function (_super) {
        tslib_1.__extends(AverageResult, _super);
        function AverageResult(source, ignoreNaN) {
            if (ignoreNaN === void 0) { ignoreNaN = true; }
            var _this = _super.call(this, source, ignoreNaN) || this;
            var count = _this.count;
            var average = !count ? NaN : _this.sum;
            if (!isNaN(average))
                average /= count;
            _this.average = average;
            return _this;
        }
        return AverageResult;
    }(SumResult_1.default));
    exports.default = AverageResult;
});
//# sourceMappingURL=AverageResult.js.map