/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var o=t(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","../../Types"],function(e,t){"use strict";function o(e,t){if(void 0===t&&(t=!1),r.Type.isPropertyKey(e))return e;if(null===e)return n;if(e===i)return r.Type.UNDEFINED;if(r.Type.hasMethod(e,f))return e.getSymbol();if(r.Type.hasMethod(e,u))return e.getHashCode();if(t)throw"Cannot create known identity.";return typeof e.toString==r.Type.FUNCTION?e.toString():Object.prototype.toString.call(e)}var r=e("../../Types"),i=void 0,n="null",f="getSymbol",u="getHashCode";t.getIdentifier=o,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=o});
//# sourceMappingURL=getIdentifier.js.map