/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../Exceptions/SystemException","../../extends"],e)}(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=e("../Exceptions/SystemException"),n=e("../../extends"),i=n["default"],u="KeyNotFoundException ",r=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return i(t,e),t.prototype.getName=function(){return u},t}(o.SystemException);t.KeyNotFoundException=r,t["default"]=r});
//# sourceMappingURL=KeyNotFoundException.js.map