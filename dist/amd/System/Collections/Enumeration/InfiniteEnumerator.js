/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./SimpleEnumerableBase","../../../extends"],function(e,t,r,n){"use strict";var o=n["default"],i=void 0,u=function(e){function t(t){e.call(this),this._factory=t}return o(t,e),t.prototype.canMoveNext=function(){return null!=this._factory},t.prototype.moveNext=function(){var e=this,t=e._factory;return t&&(e._current=t(e._current,e.incrementIndex())),t!=i},t.prototype.dispose=function(){e.prototype.dispose.call(this),this._factory=i},t}(r.SimpleEnumerableBase);t.InfiniteEnumerator=u,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u});
//# sourceMappingURL=InfiniteEnumerator.js.map
