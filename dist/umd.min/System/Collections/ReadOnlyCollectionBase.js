/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function o(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)};!function(t){if("object"==typeof module&&"object"==typeof module.exports){var e=t(require,exports);void 0!==e&&(module.exports=e)}else"function"==typeof define&&define.amd&&define(["require","exports","./CollectionBase"],t)}(function(t,e){"use strict";var o=t("./CollectionBase"),n=function(t){function e(){t.apply(this,arguments)}return __extends(e,t),e.prototype.getCount=function(){return this._getCount()},e.prototype.getIsReadOnly=function(){return!0},e.prototype._addInternal=function(t){return!1},e.prototype._removeInternal=function(t,e){return 0},e.prototype._clearInternal=function(){return 0},e.prototype.getEnumerator=function(){return this._getEnumerator()},e}(o["default"]);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=n});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map
