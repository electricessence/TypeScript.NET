/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./SimpleEnumerableBase","../../../extends"],function(e,t,n,r){"use strict";var o=r["default"],i=function(e){function t(t){e.call(this),this._factory=t}return o(t,e),t.prototype.canMoveNext=function(){return null!=this._factory},t.prototype.moveNext=function(){var e=this,t=e._factory;return!!t&&(e._current=t(e._current,e.incrementIndex()),!0)},t.prototype.dispose=function(){e.prototype.dispose.call(this),this._factory=null},t}(n.SimpleEnumerableBase);t.InfiniteEnumerator=i,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=InfiniteEnumerator.js.map