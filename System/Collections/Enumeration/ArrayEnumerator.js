/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './IndexEnumerator', '../../Types'], function (require, exports, IndexEnumerator, Types) {
    var ArrayEnumerator = (function (_super) {
        __extends(ArrayEnumerator, _super);
        function ArrayEnumerator(arrayOrFactory, start, step) {
            if (start === void 0) { start = 0; }
            if (step === void 0) { step = 1; }
            _super.call(this, function () {
                var array = Types.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
                return { source: array, pointer: start, length: (array ? array.length : 0), step: step };
            });
        }
        return ArrayEnumerator;
    })(IndexEnumerator);
    return ArrayEnumerator;
});
//# sourceMappingURL=ArrayEnumerator.js.map