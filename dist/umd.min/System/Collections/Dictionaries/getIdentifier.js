/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../../Types"],e)}(function(e,t){"use strict";function o(e,t){if(void 0===t&&(t=!1),r.Type.isPropertyKey(e))return e;if(null===e)return n;if(e===i)return r.Type.UNDEFINED;if(r.Type.hasMethod(e,u))return e.getSymbol();if(r.Type.hasMethod(e,f))return e.getHashCode();if(t){if(r.Type.isFunction(t))return t(e);throw"Cannot create known identity."}return typeof e.toString==r.Type.FUNCTION?e.toString():Object.prototype.toString.call(e)}Object.defineProperty(t,"__esModule",{value:!0});var r=e("../../Types"),i=void 0,n="null",u="getSymbol",f="getHashCode";t.getIdentifier=o,t["default"]=o});
//# sourceMappingURL=getIdentifier.js.map