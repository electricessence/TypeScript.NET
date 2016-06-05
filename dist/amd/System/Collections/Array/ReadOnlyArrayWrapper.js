/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Exceptions/ArgumentNullException","../ReadOnlyCollectionBase","../Enumeration/Enumerator","../../../extends"],function(e,t,n,r,u,o){"use strict";var i=o["default"],l=function(e){function t(t){if(e.call(this),!t)throw new n.ArgumentNullException("array");var r=this;r._getCount=function(){return t.length},r.getEnumerator=function(){return u.from(t)},r.getValueAt=function(e){return t[e]}}return i(t,e),t}(r.ReadOnlyCollectionBase);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=l});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map
