/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var n=t(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","../Exceptions/ArgumentNullException","./ReadOnlyCollectionBase","../../extends"],function(e,t){"use strict";var n=e("../Exceptions/ArgumentNullException"),o=e("./ReadOnlyCollectionBase"),r=e("../../extends"),u=r["default"],i=function(e){function t(t){var o=e.call(this)||this;if(!t)throw new n.ArgumentNullException("collection");var r=o;return r._getCount=function(){return t.count},r.getEnumerator=function(){return t.getEnumerator()},o}return u(t,e),t}(o.ReadOnlyCollectionBase);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map