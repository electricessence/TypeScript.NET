/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../../Exceptions/ArgumentNullException","../ReadOnlyCollectionBase","../Enumeration/Enumerator","../../../extends"],e)}(function(e,t){"use strict";var n=e("../../Exceptions/ArgumentNullException"),o=e("../ReadOnlyCollectionBase"),r=e("../Enumeration/Enumerator"),u=e("../../../extends"),i=u["default"],l=function(e){function t(t){if(e.call(this),!t)throw new n.ArgumentNullException("array");var o=this;o._getCount=function(){return t.length},o.getEnumerator=function(){return r.from(t)},o.getValueAt=function(e){return t[e]}}return i(t,e),t}(o.ReadOnlyCollectionBase);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=l});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map
