/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports","../../../Types","../../../Compare"],e)}(function(e,r){"use strict";function o(e){return e instanceof Array?e:[e]}function t(e,r,t){void 0===r&&(r=1),void 0===t&&(t=NaN);var a=!n.Type.isTrueNaN(t);return function(u,f){for(var p=o(e(u)),s=o(e(f)),c=Math.min(p.length,s.length),d=r instanceof Array?r:null,l=0;l<c;l++){var y=p[l],v=s[l],m=d?l<d.length?d[l]:1:r;a&&(n.Type.isTrueNaN(y)&&(y=t),n.Type.isTrueNaN(v)&&(v=t));var N=i.compare(y,v);if(0!==N)return m*N}return 0}}Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../../Types"),i=e("../../../Compare");r.createComparer=t});
//# sourceMappingURL=createComparer.js.map