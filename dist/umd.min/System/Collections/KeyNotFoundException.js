/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var o=t(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","../Exceptions/SystemException","../../extends"],function(e,t){"use strict";var o=e("../Exceptions/SystemException"),n=e("../../extends"),i=n["default"],u="KeyNotFoundException ",r=function(e){function t(){return e.apply(this,arguments)||this}return i(t,e),t.prototype.getName=function(){return u},t}(o.SystemException);t.KeyNotFoundException=r,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=KeyNotFoundException.js.map