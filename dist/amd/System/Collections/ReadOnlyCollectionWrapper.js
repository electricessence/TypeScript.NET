/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Exceptions/ArgumentNullException","./ReadOnlyCollectionBase","../../extends"],function(e,t,n,o,u){"use strict";var r=u["default"],i=function(e){function t(t){if(e.call(this),!t)throw new n.ArgumentNullException("collection");var o=this;o._getCount=function(){return t.count},o.getEnumerator=function(){return t.getEnumerator()}}return r(t,e),t}(o.ReadOnlyCollectionBase);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map
