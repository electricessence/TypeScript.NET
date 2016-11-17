/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var n=t(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","../../Exceptions/SystemException","../../../extends"],function(e,t){"use strict";var n=e("../../Exceptions/SystemException"),o=e("../../../extends"),r=o["default"],u="UnsupportedEnumerableException",i=function(e){function t(t){return e.call(this,t||"Unsupported enumerable.")||this}return r(t,e),t.prototype.getName=function(){return u},t}(n.SystemException);t.UnsupportedEnumerableException=i,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=UnsupportedEnumerableException.js.map