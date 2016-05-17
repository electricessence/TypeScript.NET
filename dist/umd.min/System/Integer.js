/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./Exceptions/ArgumentException","./Exceptions/ArgumentOutOfRangeException"],e)}(function(e,t){"use strict";function n(e){return Math.floor(e)}var r=e("./Exceptions/ArgumentException"),o=e("./Exceptions/ArgumentOutOfRangeException");t.Integer=n;var n;!function(e){function t(e){return Math.random()*e|0}function n(e){return f(e,"maxExclusive"),t(e)}function u(e){var t=0|e;return-1===e||-1!==t?t:null}function i(e){return typeof e===l&&isFinite(e)&&e===Math.floor(e)}function a(e){return e===(0|e)}function f(e,t){var n=i(e);if(!n)throw new r["default"](t||"n","Must be a integer.");return n}function c(e,t){var n=f(e,t)&&e>=0;if(!n)throw new o["default"](t||"n",e,"Must be a valid integer greater than or equal to zero.");return n}function s(e,t){var n=f(e,t)&&e>0;if(!n)throw new o["default"](t||"n",e,"Must be greater than zero.");return n}e.MAX_32_BIT=2147483647,e.random=n;var n;!function(e){function n(e,n){return f(e,"max"),0===e?0:(n&&(e+=e/Math.abs(e)),t(e))}function r(e,t,r){f(e,"min"),f(t,"max");var o=t-e;return 0===o?e:(r&&(o+=o/Math.abs(o)),e+n(o))}function o(e){return e&&e.length?e[t(e.length)]:void 0}e.next=n,e.nextInRange=r,e.select=o;var o;!function(t){function n(t){return e.select(t)}t.one=n}(o=e.select||(e.select={}))}(n=e.random||(e.random={})),e.as32Bit=u;var l="number";e.is=i,e.is32Bit=a,e.assert=f,e.assertZeroOrGreater=c,e.assertPositive=s}(n=t.Integer||(t.Integer={})),Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=Integer.js.map
