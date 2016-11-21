!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var o=r(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../../../Types","../../../Compare"],function(e,r){"use strict";function o(e){return Array.isArray(e)?e:[e]}function t(e,r,t){void 0===r&&(r=1),void 0===t&&(t=NaN);var a=!n.Type.isTrueNaN(t);return function(u,p){for(var f=o(e(u)),s=o(e(p)),y=Math.min(f.length,s.length),c=Array.isArray(r)?r:null,d=0;d<y;d++){var l=f[d],m=s[d],v=c?d<c.length?c[d]:1:r;a&&(n.Type.isTrueNaN(l)&&(l=t),n.Type.isTrueNaN(m)&&(m=t));var N=i.compare(l,m);if(0!==N)return v*N}return 0}}/*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
var n=e("../../../Types"),i=e("../../../Compare");r.createComparer=t});
//# sourceMappingURL=createComparer.js.map