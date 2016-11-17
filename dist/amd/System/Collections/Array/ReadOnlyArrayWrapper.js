/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Exceptions/ArgumentNullException","../ReadOnlyCollectionBase","../Enumeration/Enumerator","../../../extends"],function(e,t,n,r,u,o){"use strict";var i=o["default"],l=function(e){function t(t){var r=e.call(this)||this;if(!t)throw new n.ArgumentNullException("array");var o=r;return o._getCount=function(){return t.length},o.getEnumerator=function(){return u.from(t)},o.getValueAt=function(e){return t[e]},r}return i(t,e),t}(r.ReadOnlyCollectionBase);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=l});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map