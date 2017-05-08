/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../../../Exceptions/ArgumentNullException"],e)}(function(e,t){"use strict";function o(e){if(!e)throw new n.ArgumentNullException("target");var t=e.length;return e.length<2?e:r(e,0,t-1)}function r(e,t,o){if(t<o){var n=void 0,i=Math.floor((t+o)/2);n=e[i],e[i]=e[o],e[o]=n;for(var u=t,f=t;f<o;f++)e[f]<e[o]&&(n=e[u],e[u]=e[f],e[f]=n,u++);n=e[u],e[u]=e[o],e[o]=n,r(e,t,u-1),r(e,u+1,o)}return e}Object.defineProperty(t,"__esModule",{value:!0});var n=e("../../../Exceptions/ArgumentNullException");t.quickSort=o});
//# sourceMappingURL=quickSort.js.map