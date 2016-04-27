/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","./CollectionBase"],function(t,e,n){"use strict";var r=function(t){function e(){t.apply(this,arguments)}return __extends(e,t),e.prototype.getCount=function(){return this._getCount()},e.prototype.getIsReadOnly=function(){return!0},e.prototype._addInternal=function(t){return!1},e.prototype._removeInternal=function(t,e){return 0},e.prototype._clearInternal=function(){return 0},e.prototype.getEnumerator=function(){return this._getEnumerator()},e}(n["default"]);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=r});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map
