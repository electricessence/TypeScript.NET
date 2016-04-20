/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var n=e(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(["require","exports","./Types","./Exceptions/ArgumentException"],e)}(function(e,n){"use strict";function t(e){return 0|e}var t,r=e("./Types"),o=e("./Exceptions/ArgumentException");!function(e){function n(e){return Math.random()*e|0}function t(e){return i(e,"max"),0==e?0:(e+=e>0?1:-1,n(e))}function u(e){return r["default"].isNumber(e,!1)&&isFinite(e)&&e==(0|e)}function i(e,n){var t=u(e);if(!t)throw new o["default"](n||"n","Must be a integer.");return t}e.random=t;var t;!function(e){function t(e){return n(e)}function r(e){return e&&e.length?e[n(e.length)]:void 0}e.under=t,e.select=r}(t=e.random||(e.random={})),e.is=u,e.assert=i}(t||(t={})),Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=t});
//# sourceMappingURL=Integer.js.map
