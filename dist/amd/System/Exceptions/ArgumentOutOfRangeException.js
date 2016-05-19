/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","./ArgumentException"],function(t,e,n){"use strict";var o="ArgumentOutOfRangeException",r=function(t){function e(e,n,o,r){void 0===o&&(o=" "),void 0===r&&(r=null),t.call(this,e,+("("+n+") ")+o,r,function(t){t.actualValue=n})}return __extends(e,t),e.prototype.getName=function(){return o},e}(n.ArgumentException);e.ArgumentOutOfRangeException=r,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=r});
//# sourceMappingURL=ArgumentOutOfRangeException.js.map
