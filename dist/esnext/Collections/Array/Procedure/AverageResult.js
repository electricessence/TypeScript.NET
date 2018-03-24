/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import * as tslib_1 from "tslib";
import SumResult from "./SumResult";
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
}(SumResult));
export default AverageResult;
//# sourceMappingURL=AverageResult.js.map