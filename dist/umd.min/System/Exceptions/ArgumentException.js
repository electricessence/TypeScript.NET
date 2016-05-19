/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends=this&&this.__extends||function(e,t){function o(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)};!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./SystemException","../Text/Utility"],e)}(function(e,t){"use strict";var o=e("./SystemException"),n=e("../Text/Utility"),i="ArgumentException",r=function(e){function t(t,o,i,r){void 0===o&&(o=null),void 0===i&&(i=null);var u=t?"{"+t+"} ":"";e.call(this,n.trim(u+(o||"")),i,function(e){e.paramName=t,r&&r(e)})}return __extends(t,e),t.prototype.getName=function(){return i},t}(o.SystemException);t.ArgumentException=r,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=ArgumentException.js.map
