/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)};define(["require","exports","./SimpleEnumerableBase"],function(t,e,r){"use strict";var n=void 0,o=function(t){function e(e){t.call(this),this._factory=e}return __extends(e,t),e.prototype.canMoveNext=function(){return null!=this._factory},e.prototype.moveNext=function(){var t=this,e=t._factory;return e&&(t._current=e(t._current,t.incrementIndex())),e!=n},e.prototype.dispose=function(){t.prototype.dispose.call(this),this._factory=n},e}(r.SimpleEnumerableBase);e.InfiniteEnumerator=o,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o});
//# sourceMappingURL=InfiniteEnumerator.js.map
