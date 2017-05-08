/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./ArgumentException","../../extends"],e)}(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=e("./ArgumentException"),o=e("../../extends"),u=o["default"],r="ArgumentOutOfRangeException",i=function(e){function t(t,n,o,u){return void 0===o&&(o=" "),e.call(this,t,"("+n+") "+o,u,function(e){e.actualValue=n})||this}return u(t,e),t.prototype.getName=function(){return r},t}(n.ArgumentException);t.ArgumentOutOfRangeException=i,t["default"]=i});
//# sourceMappingURL=ArgumentOutOfRangeException.js.map