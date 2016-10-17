/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../../../Exceptions/ArgumentNullException"],e)}(function(e,t){"use strict";function o(e){if(!e)throw new r.ArgumentNullException("target");var t=e.length;return e.length<2?e:n(e,0,t-1)}function n(e,t,o){if(t<o){var r,i=Math.floor((t+o)/2);r=e[i],e[i]=e[o],e[o]=r;for(var u=t,f=t;f<o;f++)e[f]<e[o]&&(r=e[u],e[u]=e[f],e[f]=r,u++);r=e[u],e[u]=e[o],e[o]=r,n(e,t,u-1),n(e,u+1,o)}return e}var r=e("../../../Exceptions/ArgumentNullException");t.quickSort=o});
//# sourceMappingURL=quickSort.js.map