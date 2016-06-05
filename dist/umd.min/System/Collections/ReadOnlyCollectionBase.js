/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./CollectionBase","../../extends"],e)}(function(e,t){"use strict";var n=e("./CollectionBase"),o=e("../../extends"),r=o["default"],u=function(e){function t(){e.apply(this,arguments)}return r(t,e),t.prototype.getCount=function(){return this._getCount()},t.prototype.getIsReadOnly=function(){return!0},t.prototype._addInternal=function(e){return!1},t.prototype._removeInternal=function(e,t){return 0},t.prototype._clearInternal=function(){return 0},t.prototype.getEnumerator=function(){return this._getEnumerator()},t}(n.CollectionBase);t.ReadOnlyCollectionBase=u,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map
