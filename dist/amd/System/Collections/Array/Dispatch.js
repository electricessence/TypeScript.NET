/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","./Utility"],function(t,e,i,n){"use strict";function r(t,e,n){if(t&&t.length)for(var r=0,f=t.length;f>r;r++){var u=t[r];if(u)try{u(e)}catch(o){if(!n)throw o;i["default"].isFunction(n)&&n(o,r)}}}function f(t,e,r){if(!t)return null;var f=n.copy(t);if(t.length)for(var u=0,a=f.length;a>u;u++){var c=f[u];try{f[u]=c?c(e):o}catch(l){if(f[u]=o,!r)throw l;i["default"].isFunction(r)&&r(l,u)}}return f}function u(t,e,i){r(n.copy(t),e,i)}var o=void 0;e.unsafe=r,e.mapped=f,e.dispatch=u,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=u});
//# sourceMappingURL=Dispatch.js.map
