/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var n=t(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","./IteratorResult","../../Functions"],function(e,t){"use strict";var n=e("./IteratorResult"),o=e("../../Functions"),r=void 0;t.EmptyEnumerator=Object.freeze({current:r,moveNext:o.Functions.False,tryMoveNext:o.Functions.False,nextValue:o.Functions.Blank,next:n.IteratorResult.GetDone,"return":n.IteratorResult.GetDone,end:o.Functions.Blank,reset:o.Functions.Blank,dispose:o.Functions.Blank,isEndless:!1}),Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=t.EmptyEnumerator});
//# sourceMappingURL=EmptyEnumerator.js.map