/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./CollectionBase","../../extends"],function(t,e,n,r){"use strict";var o=r["default"],u=function(t){function e(){t.apply(this,arguments)}return o(e,t),e.prototype.getCount=function(){return this._getCount()},e.prototype.getIsReadOnly=function(){return!0},e.prototype._addInternal=function(t){return!1},e.prototype._removeInternal=function(t,e){return 0},e.prototype._clearInternal=function(){return 0},e.prototype.getEnumerator=function(){return this._getEnumerator()},e}(n.CollectionBase);e.ReadOnlyCollectionBase=u,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=u});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map
