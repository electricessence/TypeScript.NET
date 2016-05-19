/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports","../../Types","../../Compare"],e)}(function(e,r){"use strict";function t(e){return Array.isArray(e)?e:[e]}function o(e,r,o){void 0===r&&(r=1),void 0===o&&(o=NaN);var a=!n.Type.isTrueNaN(o);return function(u,f){for(var p=t(e(u)),s=t(e(f)),y=Math.min(p.length,s.length),c=Array.isArray(r)?r:null,d=0;y>d;d++){var l=p[d],m=s[d],v=c?d<c.length?c[d]:1:r;a&&(n.Type.isTrueNaN(l)&&(l=o),n.Type.isTrueNaN(m)&&(m=o));var N=i.compare(l,m);if(0!==N)return v*N}return 0}}var n=e("../../Types"),i=e("../../Compare");r.createComparer=o,r["default"]=o,r.by=o});
//# sourceMappingURL=Sort.js.map
