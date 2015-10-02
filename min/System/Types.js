/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./Functions"],function(n,e,t){var o;return function(n){function e(e){return typeof e===n.Boolean}function o(e){return typeof e===n.Number}function r(e){return typeof e===n.Number&&isNaN(e)}function u(e){return typeof e===n.String}function i(e){return typeof e===n.Function}n.Boolean=typeof!0,n.Number="number",n.String="string",n.Object=typeof{},n.Null="object",n.Undefined="undefined",n.Function=typeof t.Blank,n.isBoolean=e,n.isNumber=o,n.isTrueNaN=r,n.isString=u,n.isFunction=i}(o||(o={})),Object.freeze(o),o});
//# sourceMappingURL=Types.js.map
