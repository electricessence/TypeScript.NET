/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)};define(["require","exports","./SimpleEnumerableBase"],function(t,e,r){"use strict";var n=void 0,o=function(t){function e(e,r){t.call(this),this._iterator=e,this._isEndless=r}return __extends(e,t),e.prototype.canMoveNext=function(){return null!=this._iterator},e.prototype.moveNext=function(t){var e=this,r=e._iterator;if(r){var n=arguments.length?r.next(t):r.next();if(e._current=n.value,!n.done)return!0;e.dispose()}return!1},e.prototype.dispose=function(){t.prototype.dispose.call(this),this._iterator=n},e.prototype.getIsEndless=function(){return this._isEndless&&t.prototype.getIsEndless.call(this)},e}(r.SimpleEnumerableBase);e.IteratorEnumerator=o,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o});
//# sourceMappingURL=IteratorEnumerator.js.map
