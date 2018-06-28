/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./IteratorResult", "../../Functions"], function (exports_1, context_1) {
    "use strict";
    var IteratorResult_1, Functions_1, VOID0, EmptyEnumerator;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (IteratorResult_1_1) {
                IteratorResult_1 = IteratorResult_1_1;
            },
            function (Functions_1_1) {
                Functions_1 = Functions_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            VOID0 = void 0;
            /**
             * A simplified stripped down enumerable that is always complete and has no results.
             * Frozen and exported as 'empty' to allow for reuse.
             */
            exports_1("EmptyEnumerator", EmptyEnumerator = Object.freeze({
                current: VOID0,
                moveNext: Functions_1.Functions.False,
                tryMoveNext: Functions_1.Functions.False,
                nextValue: Functions_1.Functions.Blank,
                next: IteratorResult_1.IteratorResult.GetDone,
                "return": IteratorResult_1.IteratorResult.GetDone,
                end: Functions_1.Functions.Blank,
                reset: Functions_1.Functions.Blank,
                dispose: Functions_1.Functions.Blank,
                isEndless: false
            }));
            exports_1("default", EmptyEnumerator);
        }
    };
});
//# sourceMappingURL=EmptyEnumerator.js.map