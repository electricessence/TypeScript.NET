/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./Types","./Exceptions/ArgumentException"],function(e,n,t,r){function u(e){return 0|e}var u;!function(e){function n(e){return Math.random()*e|0}function u(e){return t["default"].isNumber(e,!1)&&e==(0|e)}function i(e,n){var t=u(e);if(!t)throw new r["default"](n||"n","Must be an integer.");return t}e.random=n,e.is=u,e.assert=i}(u||(u={})),Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=u});
//# sourceMappingURL=Integer.js.map
