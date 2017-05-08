/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../../Types","../../../Compare"],function(e,r,n,t){"use strict";function a(e){return e instanceof Array?e:[e]}function i(e,r,i){void 0===r&&(r=1),void 0===i&&(i=NaN);var u=!n.Type.isTrueNaN(i);return function(o,c){for(var f=a(e(o)),s=a(e(c)),p=Math.min(f.length,s.length),N=r instanceof Array?r:null,l=0;l<p;l++){var v=f[l],y=s[l],T=N?l<N.length?N[l]:1:r;u&&(n.Type.isTrueNaN(v)&&(v=i),n.Type.isTrueNaN(y)&&(y=i));var d=t.compare(v,y);if(0!==d)return T*d}return 0}}Object.defineProperty(r,"__esModule",{value:!0}),r.createComparer=i});
//# sourceMappingURL=createComparer.js.map