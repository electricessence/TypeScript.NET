/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(r,e){"use strict";function n(r,e){var n=r||{};for(var t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n}function t(r,e){var n=r||{};for(var t in e)e.hasOwnProperty(t)&&!n.hasOwnProperty(t)&&(n[t]=e[t]);return n}function o(r){return n({},r)}function i(r,e){return n(o(r),e)}function u(r,e){for(var n in r)e.hasOwnProperty(n)||delete r[n]}function f(r,e){if(void 0===e&&(e=1),r&&e)for(var n=0,t=Object.keys(r);n<t.length;n++){var o=t[n],i=r[o];delete r[o],f(i,e-1)}}Object.defineProperty(e,"__esModule",{value:!0}),e.apply=n,e.ensure=t,e.copy=o,e.merge=i,e.trim=u,e.wipe=f});
//# sourceMappingURL=MapUtility.js.map