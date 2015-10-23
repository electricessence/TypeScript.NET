/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var t=r(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../../Types","../../Compare"],function(e,r){function t(e){return e instanceof Array?e:[e]}function n(e,r,n){void 0===r&&(r=1),void 0===n&&(n=NaN);var u=!o["default"].isTrueNaN(n);return function(i,f){for(var d=t(e(i)),l=t(e(f)),p=Math.min(d.length,l.length),c=r instanceof Array?r:null,s=0;p>s;s++){var m=d[s],v=l[s],y=c?s<c.length?c[s]:1:r;u&&(o["default"].isTrueNaN(m)&&(m=n),o["default"].isTrueNaN(v)&&(v=n));var N=a.compare(m,v);if(0!==N)return y*N}return 0}}var o=e("../../Types"),a=e("../../Compare");r.createComparer=n,r["default"]=n,r.by=n});
//# sourceMappingURL=Sort.js.map
