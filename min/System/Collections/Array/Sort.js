/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","../../Compare"],function(r,e,n,a){function t(r){return r instanceof Array?r:[r]}function u(r,e,u){void 0===e&&(e=1),void 0===u&&(u=NaN);var i=!n["default"].isTrueNaN(u);return function(f,o){for(var l=t(r(f)),c=t(r(o)),N=Math.min(l.length,c.length),d=e instanceof Array?e:null,s=0;N>s;s++){var v=l[s],p=c[s],h=d?s<d.length?d[s]:1:e;i&&(n["default"].isTrueNaN(v)&&(v=u),n["default"].isTrueNaN(p)&&(p=u));var m=a.compare(v,p);if(0!==m)return h*m}return 0}}e.createComparer=u,e["default"]=u,e.by=u});
//# sourceMappingURL=Sort.js.map
