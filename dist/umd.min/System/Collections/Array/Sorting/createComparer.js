!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var n=r(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../../../Types","../../../Compare"],function(e,r){"use strict";function n(e){return e instanceof Array?e:[e]}function o(e,r,o){void 0===r&&(r=1),void 0===o&&(o=NaN);var a=!t.Type.isTrueNaN(o);return function(u,f){for(var p=n(e(u)),s=n(e(f)),c=Math.min(p.length,s.length),d=r instanceof Array?r:null,y=0;y<c;y++){var l=p[y],m=s[y],v=d?y<d.length?d[y]:1:r;a&&(t.Type.isTrueNaN(l)&&(l=o),t.Type.isTrueNaN(m)&&(m=o));var N=i.compare(l,m);if(0!==N)return v*N}return 0}}/*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
var t=e("../../../Types"),i=e("../../../Compare");r.createComparer=o});
//# sourceMappingURL=createComparer.js.map