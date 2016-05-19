/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","../../Exceptions/ArgumentNullException","../ReadOnlyCollectionBase","../Enumeration/Enumerator"],function(t,e,n,r,o){"use strict";var u=function(t){function e(e){if(t.call(this),!e)throw new n.ArgumentNullException("array");var r=this;r._getCount=function(){return e.length},r.getEnumerator=function(){return o.from(e)},r.getValueAt=function(t){return e[t]}}return __extends(e,t),e}(r.ReadOnlyCollectionBase);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=u});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map
