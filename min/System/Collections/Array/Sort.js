/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","../../Compare"],function(r,e,n,t){var a;return function(r){function e(r){return r instanceof Array?r:[r]}function a(r,a,i){void 0===a&&(a=1),void 0===i&&(i=NaN);var u=!n.isTrueNaN(i);return function(o,f){for(var c=e(r(o)),N=e(r(f)),s=Math.min(c.length,N.length),v=a instanceof Array?a:null,l=0;s>l;l++){var p=c[l],h=N[l],m=v?l<v.length?v[l]:1:a;u&&(n.isTrueNaN(p)&&(p=i),n.isTrueNaN(p)&&(h=i));var T=t.compare(p,h);if(0!==T)return m*T}return 0}}r.createComparer=a}(a||(a={})),Object.freeze(a),a});
//# sourceMappingURL=Sort.js.map
