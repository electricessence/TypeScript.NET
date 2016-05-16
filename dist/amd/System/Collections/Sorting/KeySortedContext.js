/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)};define(["require","exports","../../Compare","./SortContext","../../Functions"],function(e,t,r,o,n){"use strict";var i=function(e){function t(t,o,n,i){void 0===n&&(n=1),void 0===i&&(i=r.compare),e.call(this,t,i,n),this._keySelector=o}return __extends(t,e),t.prototype.compare=function(t,o){var i=this,c=i._keySelector;if(!c||c==n["default"].Identity)return e.prototype.compare.call(this,t,o);var a=r.compare(c(t),c(o));return 0==a&&i._next?i._next.compare(t,o):i._order*a},t}(o["default"]);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=KeySortedContext.js.map
