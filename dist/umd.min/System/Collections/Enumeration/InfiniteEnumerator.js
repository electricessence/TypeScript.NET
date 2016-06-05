/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./SimpleEnumerableBase","../../../extends"],e)}(function(e,t){"use strict";var o=e("./SimpleEnumerableBase"),n=e("../../../extends"),r=n["default"],i=void 0,u=function(e){function t(t){e.call(this),this._factory=t}return r(t,e),t.prototype.canMoveNext=function(){return null!=this._factory},t.prototype.moveNext=function(){var e=this,t=e._factory;return t&&(e._current=t(e._current,e.incrementIndex())),t!=i},t.prototype.dispose=function(){e.prototype.dispose.call(this),this._factory=i},t}(o.SimpleEnumerableBase);t.InfiniteEnumerator=u,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u});
//# sourceMappingURL=InfiniteEnumerator.js.map
