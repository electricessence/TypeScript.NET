/*!
 * @author electricessence / https://github.com/electricessence/
 * Special thanks to: Sebastian Belmar
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../../../Exceptions/ArgumentNullException"],e)}(function(e,t){"use strict";function o(e,t,i){if(void 0===t&&(t=0),void 0===i&&(i=e&&e.length-1),!e)throw new r.ArgumentNullException("target");if(t<i){var n,u=Math.floor((t+i)/2);n=e[u],e[u]=e[i],e[i]=n;for(var f=t,c=t;c<i;c++)e[c]<e[i]&&(n=e[f],e[f]=e[c],e[c]=n,f++);n=e[f],e[f]=e[i],e[i]=n,o(e,t,f-1),o(e,f+1,i)}return e}var r=e("../../../Exceptions/ArgumentNullException");t.quickSort=o});
//# sourceMappingURL=quickSort.js.map