/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
define(["require","exports","./SystemException","../Text/Utility","../../extends"],function(e,t,n,i,r){"use strict";var u=r["default"],o="ArgumentException",c=function(e){function t(t,n,r,u){void 0===n&&(n=null),void 0===r&&(r=null);var o=t?"{"+t+"} ":"";e.call(this,i.trim(o+(n||"")),r,function(e){e.paramName=t,u&&u(e)})}return u(t,e),t.prototype.getName=function(){return o},t}(n.SystemException);t.ArgumentException=c,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=c});
//# sourceMappingURL=ArgumentException.js.map
