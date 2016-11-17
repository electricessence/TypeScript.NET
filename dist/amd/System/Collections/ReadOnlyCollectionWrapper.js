/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Exceptions/ArgumentNullException","./ReadOnlyCollectionBase","../../extends"],function(e,t,n,r,u){"use strict";var o=u["default"],i=function(e){function t(t){var r=e.call(this)||this;if(!t)throw new n.ArgumentNullException("collection");var u=r;return u._getCount=function(){return t.count},u.getEnumerator=function(){return t.getEnumerator()},r}return o(t,e),t}(r.ReadOnlyCollectionBase);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map