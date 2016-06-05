/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./ArgumentException","../../extends"],e)}(function(e,t){"use strict";var n=e("./ArgumentException"),o=e("../../extends"),u=o["default"],i="ArgumentNullException",r=function(e){function t(t,n,o){void 0===n&&(n=""),void 0===o&&(o=null),e.call(this,t,n,o)}return u(t,e),t.prototype.getName=function(){return i},t}(n.ArgumentException);t.ArgumentNullException=r,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=ArgumentNullException.js.map
