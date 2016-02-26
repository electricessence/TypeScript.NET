/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./Types"],function(e,r,a){"use strict";function o(e,r,a){return void 0===a&&(a=!0),e===r||!a&&e==r||n(e)&&n(r)}function u(e,r,u){return void 0===u&&(u=!0),o(e,r,u)?0:e&&a["default"].hasMember(e,i)?e.compareTo(r):r&&a["default"].hasMember(r,i)?-r.compareTo(e):e>r||u&&(0===e&&0==r||null===e&&r===t)?1:r>e||u&&(0===r&&0==e||null===r&&e===t)?-1:NaN}var n=a["default"].isTrueNaN,t=void 0;r.areEqual=o;var i="compareTo";r.compare=u});
//# sourceMappingURL=Compare.js.map
