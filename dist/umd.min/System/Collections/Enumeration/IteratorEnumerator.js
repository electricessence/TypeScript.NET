/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./SimpleEnumerableBase","../../../extends"],e)}(function(e,t){"use strict";var o=e("./SimpleEnumerableBase"),r=e("../../../extends"),n=r["default"],i=void 0,s=function(e){function t(t,o){e.call(this),this._iterator=t,this._isEndless=o}return n(t,e),t.prototype.canMoveNext=function(){return null!=this._iterator},t.prototype.moveNext=function(e){var t=this,o=t._iterator;if(o){var r=arguments.length?o.next(e):o.next();if(t._current=r.value,!r.done)return!0;t.dispose()}return!1},t.prototype.dispose=function(){e.prototype.dispose.call(this),this._iterator=i},t.prototype.getIsEndless=function(){return this._isEndless&&e.prototype.getIsEndless.call(this)},t}(o.SimpleEnumerableBase);t.IteratorEnumerator=s,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=s});
//# sourceMappingURL=IteratorEnumerator.js.map
