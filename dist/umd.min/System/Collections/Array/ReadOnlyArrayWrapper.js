/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../ReadOnlyCollectionWrapper","../../../extends"],e)}(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=e("../ReadOnlyCollectionWrapper"),n=e("../../../extends"),r=n["default"],i=function(e){function t(t){var o=e.call(this,t)||this;return o.__getValueAt=function(e){return t[e]},o}return r(t,e),t.prototype._onDispose=function(){e.prototype._onDispose.call(this),this.__getValueAt=null},t.prototype.getValueAt=function(e){return this.throwIfDisposed(),this.__getValueAt(e)},t}(o["default"]);t["default"]=i});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map