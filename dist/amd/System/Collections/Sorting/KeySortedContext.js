/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function o(){this.constructor=t}for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)};define(["require","exports","../../Compare","./SortContext","../../Functions"],function(t,e,o,r,n){"use strict";var i=function(t){function e(e,r,n,i){void 0===n&&(n=1),void 0===i&&(i=o.compare),t.call(this,e,i,n),this._keySelector=r}return __extends(e,t),e.prototype.compare=function(e,r){var i=this,c=i._keySelector;if(!c||c==n.Functions.Identity)return t.prototype.compare.call(this,e,r);var p=o.compare(c(e),c(r));return 0==p&&i._next?i._next.compare(e,r):i._order*p},e}(r.SortContext);e.KeySortedContext=i,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=i});
//# sourceMappingURL=KeySortedContext.js.map
