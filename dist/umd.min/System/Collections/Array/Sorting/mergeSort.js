!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var o=t(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","../../../Exceptions/ArgumentNullException","../Utility"],function(e,t){"use strict";/**
     * Merge internalSort O(n log (n))
     * Warning: Uses recursion.
     * @param target
     * @returns {number[]}
     */
function o(e){if(!e)throw new i.ArgumentNullException("target");var t=e.length;return t<2?e:r(e,0,t,n.initialize(t))}function r(e,t,o,i){if(o-t>1){var n=Math.floor((t+o)/2);r(e,t,n,i),r(e,n,o,i);for(var u=0,f=e.length;u<f;u++)i[u]=e[u];for(var l=t,c=t,p=n;c<n&&p<o;)e[l++]=i[c]>i[p]?i[p++]:i[c++];for(;c<n;)e[l++]=i[c++]}return e}var i=e("../../../Exceptions/ArgumentNullException"),n=e("../Utility");t.mergeSort=o});
//# sourceMappingURL=mergeSort.js.map