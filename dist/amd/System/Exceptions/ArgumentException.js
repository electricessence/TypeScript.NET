/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","./SystemException","../Text/Utility"],function(t,e,n,o){"use strict";var r="ArgumentException",i=function(t){function e(e,n,r,i){void 0===n&&(n=null),void 0===r&&(r=null);var u=e?"{"+e+"} ":"";t.call(this,o.trim(u+(n||"")),r,function(t){t.paramName=e,i&&i(t)})}return __extends(e,t),e.prototype.getName=function(){return r},e}(n.SystemException);e.ArgumentException=i,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=i});
//# sourceMappingURL=ArgumentException.js.map
