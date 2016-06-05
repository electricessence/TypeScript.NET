/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../Exceptions/ArgumentNullException","./ReadOnlyCollectionBase","../../extends"],e)}(function(e,t){"use strict";var n=e("../Exceptions/ArgumentNullException"),o=e("./ReadOnlyCollectionBase"),u=e("../../extends"),i=u["default"],r=function(e){function t(t){if(e.call(this),!t)throw new n.ArgumentNullException("collection");var o=this;o._getCount=function(){return t.count},o.getEnumerator=function(){return t.getEnumerator()}}return i(t,e),t}(o.ReadOnlyCollectionBase);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map
