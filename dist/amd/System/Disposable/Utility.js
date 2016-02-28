/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,n,i){"use strict";function r(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];f(e,!1)}function t(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];return f(e,!0)}function s(e,n){return e&&e.length?f(e.slice(),n):null}function o(e,n){try{return n(e)}finally{u(e,!1)}}function u(e,n){if(i["default"].of(e).member("dispose").isFunction)if(n)try{e.dispose()}catch(r){return r}else e.dispose();return null}function f(e,n,i){void 0===i&&(i=0);for(var r,t=e.length;t>i;i++){var s=e[i];if(s)if(n){var o=u(s,!0);o&&(r||(r=[]),r.push(o))}else{var l=!1;try{u(s,!1),l=!0}finally{!l&&t>i+1&&f(e,!1,i+1)}if(!l)break}}return r}n.dispose=r,n.disposeWithoutException=t,n.disposeThese=s,n.using=o});
//# sourceMappingURL=Utility.js.map
