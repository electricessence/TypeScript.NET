/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
System.register(["./EmptyEnumerator"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EmptyEnumerator_1, EmptyEnumerable;
    return {
        setters: [
            function (EmptyEnumerator_1_1) {
                EmptyEnumerator_1 = EmptyEnumerator_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT
             */
            EmptyEnumerable = /** @class */ (function () {
                function EmptyEnumerable() {
                    this.isEndless = false;
                }
                EmptyEnumerable.prototype.getEnumerator = function () {
                    return EmptyEnumerator_1.EmptyEnumerator;
                };
                return EmptyEnumerable;
            }());
            exports_1("EmptyEnumerable", EmptyEnumerable);
        }
    };
});
//# sourceMappingURL=EmptyEnumerable.js.map