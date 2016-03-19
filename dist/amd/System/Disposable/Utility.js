/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,n,r){"use strict";function t(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];f(e,!1)}function i(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];return f(e,!0)}function s(e,n){return e&&e.length?f(e.slice(),n):null}function u(e,n){try{return n(e)}finally{o(e,!1)}}function o(e,n){if(r["default"].of(e).member("dispose").isFunction)if(n)try{e.dispose()}catch(t){return t}else e.dispose();return null}function f(e,n,r){void 0===r&&(r=0);for(var t,i=e.length;i>r;r++){var s=e[r];if(s)if(n){var u=o(s,!0);u&&(t||(t=[]),t.push(u))}else{var l=!1;try{o(s,!1),l=!0}finally{!l&&i>r+1&&f(e,!1,r+1)}if(!l)break}}return t}n.dispose=t,n.disposeWithoutException=i,n.disposeThese=s,n.using=u});
//# sourceMappingURL=Utility.js.map
