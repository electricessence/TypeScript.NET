/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports","../../Types","../../Compare"],e)}(function(e,r){"use strict";function t(e){return Array.isArray(e)?e:[e]}function o(e,r,o){void 0===r&&(r=1),void 0===o&&(o=NaN);var u=!a["default"].isTrueNaN(o);return function(i,f){for(var d=t(e(i)),s=t(e(f)),l=Math.min(d.length,s.length),p=Array.isArray(r)?r:null,c=0;l>c;c++){var y=d[c],m=s[c],v=p?c<p.length?p[c]:1:r;u&&(a["default"].isTrueNaN(y)&&(y=o),a["default"].isTrueNaN(m)&&(m=o));var N=n.compare(y,m);if(0!==N)return v*N}return 0}}var a=e("../../Types"),n=e("../../Compare");r.createComparer=o,r["default"]=o,r.by=o});
//# sourceMappingURL=Sort.js.map
