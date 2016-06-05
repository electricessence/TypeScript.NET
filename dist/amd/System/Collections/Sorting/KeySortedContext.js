/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Compare","./SortContext","../../Functions","../../../extends"],function(e,t,o,r,n,i){"use strict";var c=i["default"],u=function(e){function t(t,r,n,i){void 0===n&&(n=1),void 0===i&&(i=o.compare),e.call(this,t,i,n),this._keySelector=r}return c(t,e),t.prototype.compare=function(t,r){var i=this,c=i._keySelector;if(!c||c==n.Functions.Identity)return e.prototype.compare.call(this,t,r);var u=o.compare(c(t),c(r));return 0==u&&i._next?i._next.compare(t,r):i._order*u},t}(r.SortContext);t.KeySortedContext=u,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u});
//# sourceMappingURL=KeySortedContext.js.map
