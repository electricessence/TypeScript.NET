/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import IndexEnumerator from "./IndexEnumerator";
var ArrayEnumerator = /** @class */ (function (_super) {
    tslib_1.__extends(ArrayEnumerator, _super);
    function ArrayEnumerator(arrayOrFactory, start, step) {
        if (start === void 0) { start = 0; }
        if (step === void 0) { step = 1; }
        return _super.call(this, function () {
            var array = typeof arrayOrFactory == "function" /* Function */ ? arrayOrFactory() : arrayOrFactory;
            return {
                source: array,
                pointer: start,
                length: array ? array.length : 0,
                step: step
            };
        }) || this;
    }
    return ArrayEnumerator;
}(IndexEnumerator));
export default ArrayEnumerator;
//# sourceMappingURL=ArrayEnumerator.js.map