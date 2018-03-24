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
        define(["require", "exports", "tslib", "./Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Promise_1 = require("./Promise");
    /**
     * By providing an ArrayPromise we expose useful methods/shortcuts for dealing with array results.
     */
    var ArrayPromise = /** @class */ (function (_super) {
        tslib_1.__extends(ArrayPromise, _super);
        function ArrayPromise() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Simplifies the use of a map function on an array of results when the source is assured to be an array.
         * @param transform
         * @returns {PromiseBase<Array<any>>}
         */
        ArrayPromise.prototype.map = function (transform) {
            var _this = this;
            this.throwIfDisposed();
            return new ArrayPromise(function (resolve) {
                _this.doneNow(function (result) { return resolve(result.map(transform)); });
            }, true);
        };
        /**
         * Simplifies the use of a reduce function on an array of results when the source is assured to be an array.
         * @param reduction
         * @param initialValue
         * @returns {PromiseBase<any>}
         */
        ArrayPromise.prototype.reduce = function (reduction, initialValue) {
            return this
                .thenSynchronous(function (result) { return result.reduce(reduction, initialValue); });
        };
        ArrayPromise.fulfilled = function (value) {
            return new ArrayPromise(function (resolve) { return value; }, true);
        };
        return ArrayPromise;
    }(Promise_1.default));
    exports.default = ArrayPromise;
});
//# sourceMappingURL=ArrayPromise.js.map