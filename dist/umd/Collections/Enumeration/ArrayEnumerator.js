/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./IndexEnumerator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var IndexEnumerator_1 = require("./IndexEnumerator");
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
    }(IndexEnumerator_1.default));
    exports.default = ArrayEnumerator;
});
//# sourceMappingURL=ArrayEnumerator.js.map