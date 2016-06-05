/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./IndexEnumerator", "../../Types", "../../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var IndexEnumerator_1, Types_1, extends_1;
    var __extends, ArrayEnumerator;
    return {
        setters:[
            function (IndexEnumerator_1_1) {
                IndexEnumerator_1 = IndexEnumerator_1_1;
            },
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            ArrayEnumerator = (function (_super) {
                __extends(ArrayEnumerator, _super);
                function ArrayEnumerator(arrayOrFactory, start, step) {
                    if (start === void 0) { start = 0; }
                    if (step === void 0) { step = 1; }
                    _super.call(this, function () {
                        var array = Types_1.Type.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
                        return {
                            source: array,
                            pointer: start,
                            length: array ? array.length : 0,
                            step: step
                        };
                    });
                }
                return ArrayEnumerator;
            }(IndexEnumerator_1.IndexEnumerator));
            exports_1("ArrayEnumerator", ArrayEnumerator);
            exports_1("default",ArrayEnumerator);
        }
    }
});
//# sourceMappingURL=ArrayEnumerator.js.map