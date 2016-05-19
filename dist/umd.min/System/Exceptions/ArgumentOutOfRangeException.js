/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)};!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./ArgumentException"],e)}(function(e,t){"use strict";var n=e("./ArgumentException"),o="ArgumentOutOfRangeException",r=function(e){function t(t,n,o,r){void 0===o&&(o=" "),void 0===r&&(r=null),e.call(this,t,+("("+n+") ")+o,r,function(e){e.actualValue=n})}return __extends(t,e),t.prototype.getName=function(){return o},t}(n.ArgumentException);t.ArgumentOutOfRangeException=r,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=ArgumentOutOfRangeException.js.map
