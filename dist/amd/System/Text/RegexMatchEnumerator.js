/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./RegularExpressions","../Collections/Enumeration/EmptyEnumerator","../Collections/Enumeration/EnumeratorBase"],function(e,t,n,r,a){"use strict";var u=function(){function e(e){e instanceof n.Regex?this._pattern=e:this._pattern=new n.Regex(e)}return e.prototype.matches=function(e){var t,n=this;return new a.EnumeratorBase(function(){t=0},function(r){var a=n._pattern.match(e,t);return a.success?(t=a.index+a.length,r.yieldReturn(a)):r.yieldBreak()})},e.matches=function(t,n){return t&&n?new e(n).matches(t):r.EmptyEnumerator},e}();t.RegexMatchEnumerator=u,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u.matches});
//# sourceMappingURL=RegexMatchEnumerator.js.map
