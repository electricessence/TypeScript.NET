/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","../../Compare"],function(r,e,a,n){"use strict";function t(r){return Array.isArray(r)?r:[r]}function i(r,e,i){void 0===e&&(e=1),void 0===i&&(i=NaN);var u=!a.Type.isTrueNaN(i);return function(o,s){for(var y=t(r(o)),f=t(r(s)),p=Math.min(y.length,f.length),N=Array.isArray(e)?e:null,c=0;p>c;c++){var T=y[c],l=f[c],v=N?c<N.length?N[c]:1:e;u&&(a.Type.isTrueNaN(T)&&(T=i),a.Type.isTrueNaN(l)&&(l=i));var d=n.compare(T,l);if(0!==d)return v*d}return 0}}e.createComparer=i,e["default"]=i,e.by=i});
//# sourceMappingURL=Sort.js.map
