/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(e,t){function o(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)};!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./SimpleEnumerableBase"],e)}(function(e,t){"use strict";var o=e("./SimpleEnumerableBase"),r=void 0,n=function(e){function t(t){e.call(this),this._factory=t}return __extends(t,e),t.prototype.canMoveNext=function(){return null!=this._factory},t.prototype.moveNext=function(){var e=this,t=e._factory;return t&&(e._current=t(e._current,e.incrementIndex())),t!=r},t.prototype.dispose=function(){e.prototype.dispose.call(this),this._factory=r},t}(o.SimpleEnumerableBase);t.InfiniteEnumerator=n,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=InfiniteEnumerator.js.map
