/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","../../Compare"],function(r,e,n,a){function t(r){return r instanceof Array?r:[r]}function i(r,e,i){void 0===e&&(e=1),void 0===i&&(i=NaN);var o=!n.isTrueNaN(i);return function(u,f){for(var c=t(r(u)),N=t(r(f)),s=Math.min(c.length,N.length),v=e instanceof Array?e:null,l=0;s>l;l++){var p=c[l],h=N[l],m=v?l<v.length?v[l]:1:e;o&&(n.isTrueNaN(p)&&(p=i),n.isTrueNaN(p)&&(h=i));var T=a.compare(p,h);if(0!==T)return m*T}return 0}}e.createComparer=i});
//# sourceMappingURL=Sort.js.map
