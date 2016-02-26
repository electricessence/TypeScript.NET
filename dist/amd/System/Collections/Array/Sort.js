/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","../../Compare"],function(r,e,a,t){"use strict";function n(r){return Array.isArray(r)?r:[r]}function u(r,e,u){void 0===e&&(e=1),void 0===u&&(u=NaN);var i=!a["default"].isTrueNaN(u);return function(f,o){for(var l=n(r(f)),s=n(r(o)),N=Math.min(l.length,s.length),c=Array.isArray(e)?e:null,d=0;N>d;d++){var v=l[d],y=s[d],p=c?d<c.length?c[d]:1:e;i&&(a["default"].isTrueNaN(v)&&(v=u),a["default"].isTrueNaN(y)&&(y=u));var h=t.compare(v,y);if(0!==h)return p*h}return 0}}e.createComparer=u,e["default"]=u,e.by=u});
//# sourceMappingURL=Sort.js.map
