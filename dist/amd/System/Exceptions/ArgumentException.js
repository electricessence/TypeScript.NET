/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","./SystemException","../Text/Utility"],function(t,e,n,r){"use strict";var o="ArgumentException",i=function(t){function e(e,n,o,i){void 0===n&&(n=null),void 0===o&&(o=null);var u=e?"{"+e+"} ":"";t.call(this,r.trim(u+n),o,function(t){t.paramName=e,i&&i(t)})}return __extends(e,t),e.prototype.getName=function(){return o},e.prototype.toString=function(){var t=this;return"["+t.name+": "+t.message+"]"},e}(n["default"]);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=i});
//# sourceMappingURL=ArgumentException.js.map
