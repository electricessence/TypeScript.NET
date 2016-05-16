/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Compare"],function(e,r,t){"use strict";var n=function(){function e(e,r,n){void 0===r&&(r=t.compare),void 0===n&&(n=1),this._next=e,this._comparer=r,this._order=n}return Object.defineProperty(e.prototype,"order",{get:function(){return this._order},enumerable:!0,configurable:!0}),e.prototype.generateSortedIndexes=function(e){var r=this;if(null==e)return[];var t=e.map(function(e,r){return r});return t.sort(function(t,n){return r.compare(e[t],e[n])}),t},e.prototype.compare=function(e,r){var t=this,n=t._comparer(e,r);return 0==n&&t._next?t._next.compare(e,r):t._order*n},e}();Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=n});
//# sourceMappingURL=SortContext.js.map
