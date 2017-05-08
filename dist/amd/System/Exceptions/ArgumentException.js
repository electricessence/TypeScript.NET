/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
define(["require","exports","./SystemException","../Text/Utility","../../extends"],function(t,e,n,i,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var u=r["default"],o="ArgumentException",c=function(t){function e(e,n,r,u){var o=this,c=e?"{"+e+"} ":"";return o=t.call(this,i.trim(c+(n||"")),r,function(t){t.paramName=e,u&&u(t)})||this}return u(e,t),e.prototype.getName=function(){return o},e}(n.SystemException);e.ArgumentException=c,e["default"]=c});
//# sourceMappingURL=ArgumentException.js.map