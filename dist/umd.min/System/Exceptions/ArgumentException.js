/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./SystemException","../Text/Utility","../../extends"],e)}(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=e("./SystemException"),i=e("../Text/Utility"),o=e("../../extends"),r=o["default"],u="ArgumentException",c=function(e){function t(t,n,o,r){var u=this,c=t?"{"+t+"} ":"";return u=e.call(this,i.trim(c+(n||"")),o,function(e){e.paramName=t,r&&r(e)})||this}return r(t,e),t.prototype.getName=function(){return u},t}(n.SystemException);t.ArgumentException=c,t["default"]=c});
//# sourceMappingURL=ArgumentException.js.map