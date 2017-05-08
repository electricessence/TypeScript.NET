/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}(function(e,r){"use strict";function n(e,r){var n=e||{};for(var t in r)r.hasOwnProperty(t)&&(n[t]=r[t]);return n}function t(e,r){var n=e||{};for(var t in r)r.hasOwnProperty(t)&&!n.hasOwnProperty(t)&&(n[t]=r[t]);return n}function o(e){return n({},e)}function i(e,r){return n(o(e),r)}function f(e,r){for(var n in e)r.hasOwnProperty(n)||delete e[n]}function u(e,r){if(void 0===r&&(r=1),e&&r)for(var n=0,t=Object.keys(e);n<t.length;n++){var o=t[n],i=e[o];delete e[o],u(i,r-1)}}Object.defineProperty(r,"__esModule",{value:!0}),r.apply=n,r.ensure=t,r.copy=o,r.merge=i,r.trim=f,r.wipe=u});
//# sourceMappingURL=MapUtility.js.map