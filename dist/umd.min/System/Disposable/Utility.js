/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var n=e(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(["require","exports","../Types"],e)}(function(e,n){"use strict";function t(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];s(e,!1)}function i(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];return s(e,!0)}function r(e,n){return e&&e.length?s(e.slice(),n):null}function o(e,n){try{return n(e)}finally{f(e,!1)}}function f(e,n){if(u["default"].of(e).member("dispose").isFunction)if(n)try{e.dispose()}catch(t){return t}else e.dispose();return null}function s(e,n,t){void 0===t&&(t=0);for(var i,r=e.length;r>t;t++){var o=e[t];if(o)if(n){var u=f(o,!0);u&&(i||(i=[]),i.push(u))}else{var l=!1;try{f(o,!1),l=!0}finally{!l&&r>t+1&&s(e,!1,t+1)}if(!l)break}}return i}var u=e("../Types");n.dispose=t,n.disposeWithoutException=i,n.disposeThese=r,n.using=o});
//# sourceMappingURL=Utility.js.map
