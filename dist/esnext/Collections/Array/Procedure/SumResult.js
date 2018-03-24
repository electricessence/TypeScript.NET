/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Represents an immutable struct of the sum of a set of values.
 */
var SumResult = /** @class */ (function () {
    function SumResult(source, ignoreNaN) {
        if (ignoreNaN === void 0) { ignoreNaN = false; }
        var count = 0;
        var sum = 0;
        var len = source && source.length || 0;
        if (len) {
            if (ignoreNaN) {
                for (var i = 0; i < len; i++) {
                    var n = source[i];
                    if (!isNaN(n)) {
                        count++;
                        sum += n;
                    }
                }
            }
            else {
                count = len;
                for (var i = 0; i < len; i++) {
                    sum += source[i];
                    if (isNaN(sum))
                        break;
                }
            }
        }
        this.count = count;
        this.sum = sum;
    }
    return SumResult;
}());
export default SumResult;
//# sourceMappingURL=SumResult.js.map