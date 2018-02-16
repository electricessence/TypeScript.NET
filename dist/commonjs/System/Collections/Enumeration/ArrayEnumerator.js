"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var IndexEnumerator_1 = require("./IndexEnumerator");
var Types_1 = require("../../Types");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var ArrayEnumerator = /** @class */ (function (_super) {
    __extends(ArrayEnumerator, _super);
    function ArrayEnumerator(arrayOrFactory, start, step) {
        if (start === void 0) { start = 0; }
        if (step === void 0) { step = 1; }
        return _super.call(this, function () {
            var array = Types_1.Type.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
            return {
                source: array,
                pointer: start,
                length: array ? array.length : 0,
                step: step
            };
        }) || this;
    }
    return ArrayEnumerator;
}(IndexEnumerator_1.IndexEnumerator));
exports.ArrayEnumerator = ArrayEnumerator;
exports.default = ArrayEnumerator;
//# sourceMappingURL=ArrayEnumerator.js.map