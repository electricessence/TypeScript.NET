/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./SystemException","../Text/Utility","../../extends"],e)}(function(e,t){"use strict";var n=e("./SystemException"),o=e("../Text/Utility"),i=e("../../extends"),r=i["default"],u="ArgumentException",c=function(e){function t(t,n,i,r){void 0===n&&(n=null),void 0===i&&(i=null);var u=t?"{"+t+"} ":"";e.call(this,o.trim(u+(n||"")),i,function(e){e.paramName=t,r&&r(e)})}return r(t,e),t.prototype.getName=function(){return u},t}(n.SystemException);t.ArgumentException=c,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=c});
//# sourceMappingURL=ArgumentException.js.map
