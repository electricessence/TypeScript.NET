/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,n,i){"use strict";function r(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];c(e,!1)}function t(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];f(e)}function s(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];return c(e,!0)}function o(e,n){return e&&e.length?c(e.slice(),n):null}function f(e,n){void 0===n&&(n=0),e&&e.length&&(n>=0||(n=0),setTimeout(c,n,e.slice(),!0))}function u(e,n){try{return n(e)}finally{l(e,!1)}}function l(e,n){if(i["default"].of(e).member("dispose").isFunction)if(n)try{e.dispose()}catch(r){return r}else e.dispose();return null}function c(e,n,i){void 0===i&&(i=0);for(var r,t=e.length;t>i;i++){var s=e[i];if(s)if(n){var o=l(s,!0);o&&(r||(r=[]),r.push(o))}else{var f=!1;try{l(s,!1),f=!0}finally{!f&&t>i+1&&c(e,!1,i+1)}if(!f)break}}return r}n.dispose=r,n.disposeDeferred=t,n.disposeWithoutException=s,n.disposeThese=o,n.disposeTheseDeferred=f,n.using=u});
//# sourceMappingURL=Utility.js.map
