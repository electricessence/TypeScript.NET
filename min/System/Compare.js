/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./Types"],function(n,r,e){var u,i=e.isTrueNaN;return function(n){function r(n,r,e){return void 0===e&&(e=!0),n===r||!e&&n==r||i(n)&&i(r)}function e(n,e,u){return void 0===u&&(u=!0),r(n,e,u)?0:n>e||u&&(0===n&&0==e||null===n&&void 0===e)?1:e>n||u&&(0===e&&0==n||null===e&&void 0===n)?-1:NaN}n.areEqual=r,n.compare=e}(u||(u={})),u});
//# sourceMappingURL=Compare.js.map
