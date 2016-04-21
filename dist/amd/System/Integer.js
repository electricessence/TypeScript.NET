/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./Types","./Exceptions/ArgumentException","./Exceptions/ArgumentOutOfRangeException"],function(e,n,t,r,u){"use strict";function i(e){return 0|e}var i;!function(e){function n(e){return Math.random()*e|0}function i(e){return a(e,"max"),0==e?0:(e+=e>0?1:-1,n(e))}function o(e){return t["default"].isNumber(e,!1)&&isFinite(e)&&e==(0|e)}function a(e,n){var t=o(e);if(!t)throw new r["default"](n||"n","Must be a integer.");return t}function f(e,n){var t=a(e,n)&&e>=0;if(!t)throw new u["default"](n||"n",e,"Cannot be less than zero.");return t}function s(e,n){var t=a(e,n)&&e>0;if(!t)throw new u["default"](n||"n",e,"Must be greater than zero.");return t}e.random=i;var i;!function(e){function t(e){return n(e)}function r(e){return e&&e.length?e[n(e.length)]:void 0}e.under=t,e.select=r}(i=e.random||(e.random={})),e.is=o,e.assert=a,e.assertZeroOrGreater=f,e.assertPositive=s}(i||(i={})),Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=i});
//# sourceMappingURL=Integer.js.map
