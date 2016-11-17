/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var o=t(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","../Exception","../../extends"],function(e,t){"use strict";var o=e("../Exception"),n=e("../../extends"),i=n["default"],r="SystemException",u=function(e){function t(){return e.apply(this,arguments)||this}return i(t,e),t.prototype.getName=function(){return r},t}(o.Exception);t.SystemException=u,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u});
//# sourceMappingURL=SystemException.js.map