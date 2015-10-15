/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","./SystemException"],function(t,e,n){var r="ArgumentException",o=function(t){function e(e,n,r){void 0===n&&(n=null),void 0===r&&(r=null),this.paramName=e,t.call(this,n,r)}return __extends(e,t),e.prototype.getName=function(){return r},e.prototype.toString=function(){var t=this,e=t.paramName;return e=e?"{"+e+"} ":"","["+t.name+": "+e+t.message+"]"},e}(n["default"]);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o});
//# sourceMappingURL=ArgumentException.js.map
