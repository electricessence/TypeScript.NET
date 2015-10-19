/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./Types"],function(e,n,r){function u(e,n,r){return void 0===r&&(r=!0),e===n||!r&&e==n||o(e)&&o(n)}function i(e,n,r){return void 0===r&&(r=!0),u(e,n,r)?0:e>n||r&&(0===e&&0==n||null===e&&void 0===n)?1:n>e||r&&(0===n&&0==e||null===n&&void 0===e)?-1:NaN}var o=r["default"].isTrueNaN;n.areEqual=u,n.compare=i});
//# sourceMappingURL=Compare.js.map
