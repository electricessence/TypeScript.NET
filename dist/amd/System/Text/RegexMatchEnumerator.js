/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./RegularExpressions","../Collections/Enumeration/Enumerator","../Collections/Enumeration/EnumeratorBase"],function(e,t,n,r,u){"use strict";var a=function(){function e(e){e instanceof n.Regex?this._pattern=e:this._pattern=new n.Regex(e)}return e.prototype.matches=function(e){var t,n=this;return new u["default"](function(){t=0},function(r){var u=n._pattern.match(e,t);return u.success?(t=u.index+u.length,r.yieldReturn(u)):r.yieldBreak()})},e.matches=function(t,n){return t&&n?new e(n).matches(t):r.empty},e}();t.RegexMatchEnumerator=a,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a.matches});
//# sourceMappingURL=RegexMatchEnumerator.js.map
