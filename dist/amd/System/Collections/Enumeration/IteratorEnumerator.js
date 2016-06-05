/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./SimpleEnumerableBase","../../../extends"],function(e,t,r,n){"use strict";var o=n["default"],i=void 0,s=function(e){function t(t,r){e.call(this),this._iterator=t,this._isEndless=r}return o(t,e),t.prototype.canMoveNext=function(){return null!=this._iterator},t.prototype.moveNext=function(e){var t=this,r=t._iterator;if(r){var n=arguments.length?r.next(e):r.next();if(t._current=n.value,!n.done)return!0;t.dispose()}return!1},t.prototype.dispose=function(){e.prototype.dispose.call(this),this._iterator=i},t.prototype.getIsEndless=function(){return this._isEndless&&e.prototype.getIsEndless.call(this)},t}(r.SimpleEnumerableBase);t.IteratorEnumerator=s,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=s});
//# sourceMappingURL=IteratorEnumerator.js.map
