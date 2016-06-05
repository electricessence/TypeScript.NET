/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../Exceptions/InvalidOperationException","../../extends"],e)}(function(e,t){"use strict";var o=e("../Exceptions/InvalidOperationException"),n=e("../../extends"),i=n["default"],r="ObjectDisposedException",p=function(e){function t(t,o,n){void 0===o&&(o=null),void 0===n&&(n=null),e.call(this,o,n,function(e){e.objectName=t})}return i(t,e),t.prototype.getName=function(){return r},t.prototype.toString=function(){var e=this,t=e.objectName;return t=t?"{"+t+"} ":"","["+e.name+": "+t+e.message+"]"},t.throwIfDisposed=function(e,o,n){if(e.wasDisposed)throw new t(o,n)},t}(o.InvalidOperationException);t.ObjectDisposedException=p,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=p});
//# sourceMappingURL=ObjectDisposedException.js.map
