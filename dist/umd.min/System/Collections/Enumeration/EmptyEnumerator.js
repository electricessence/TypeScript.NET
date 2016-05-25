/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./IteratorResult","../../Functions"],e)}(function(e,t){"use strict";var o=e("./IteratorResult"),n=e("../../Functions"),r=void 0;t.EmptyEnumerator=Object.freeze({current:r,moveNext:n.Functions.False,nextValue:n.Functions.Blank,next:o.IteratorResult.GetDone,"return":o.IteratorResult.GetDone,reset:n.Functions.Blank,dispose:n.Functions.Blank,isEndless:!1}),Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=t.EmptyEnumerator});
//# sourceMappingURL=EmptyEnumerator.js.map
