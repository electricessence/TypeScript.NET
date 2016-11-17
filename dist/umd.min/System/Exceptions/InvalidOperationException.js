/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var n=t(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","./SystemException","../../extends"],function(e,t){"use strict";var n=e("./SystemException"),o=e("../../extends"),i=o["default"],r="InvalidOperationException",p=function(e){function t(){return e.apply(this,arguments)||this}return i(t,e),t.prototype.getName=function(){return r},t}(n.SystemException);t.InvalidOperationException=p,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=p});
//# sourceMappingURL=InvalidOperationException.js.map