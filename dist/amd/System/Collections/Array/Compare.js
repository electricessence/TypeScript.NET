/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Compare","../../Types"],function(r,e,n,t){"use strict";function a(r,e){if(r&&e&&r===e||!r&&!e)return!0;if(!r||!e)return!1;var n=r.length;return n!==e.length?!1:0===n?!0:n}function o(r,e,t){if(void 0===t&&(t=n.areEqual),!r)throw new Error("ArgumentNullException: 'arrays' cannot be null.");if(r.length<2)throw new Error("Cannot compare a set of arrays less than 2.");for(var a=r[0],o=0,i=r.length;i>o;o++)if(!u(a,r[o],e,t))return!1;return!0}function u(r,e,o,u){void 0===u&&(u=n.areEqual);var i=a(r,e);if(t.Type.isBoolean(i))return i;for(var f=0;i>f;f++)if(!u(r[f],e[f],o))return!1;return!0}function i(r,e){if(!r||r.length<2)return r;var n,t=r.length;t>65536?n=new Array(t):(n=[],n.length=t);for(var a=0;t>a;a++)n[a]=r[a];return n.sort(e),n}function f(r,e,o){void 0===o&&(o=n.compare);var u=a(r,e);if(t.Type.isBoolean(u))return u;r=i(r,o),e=i(e,o);for(var f=0;u>f;f++)if(0!==o(r[f],e[f]))return!1;return!0}e.areAllEqual=o,e.areEqual=u,e.areEquivalent=f});
//# sourceMappingURL=Compare.js.map
