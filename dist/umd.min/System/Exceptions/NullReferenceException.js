/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./SystemException","../../extends"],e)}(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=e("./SystemException"),o=e("../../extends"),i=o["default"],r="NullReferenceException",u=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return i(t,e),t.prototype.getName=function(){return r},t}(n.SystemException);t["default"]=u});
//# sourceMappingURL=NullReferenceException.js.map