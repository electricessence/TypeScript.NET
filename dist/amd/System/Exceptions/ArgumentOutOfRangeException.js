/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
define(["require","exports","./ArgumentException","../../extends"],function(e,t,n,u){"use strict";var i=u["default"],o="ArgumentOutOfRangeException",r=function(e){function t(t,n,u,i){void 0===u&&(u=" "),void 0===i&&(i=null),e.call(this,t,+("("+n+") ")+u,i,function(e){e.actualValue=n})}return i(t,e),t.prototype.getName=function(){return o},t}(n.ArgumentException);t.ArgumentOutOfRangeException=r,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=ArgumentOutOfRangeException.js.map
