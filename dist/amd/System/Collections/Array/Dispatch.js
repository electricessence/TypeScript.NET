/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","./Utility"],function(t,e,i,n){"use strict";function r(t,e,n){if(t&&t.length)for(var r=0,f=t.length;f>r;r++){var o=t[r];if(o)try{o(e)}catch(u){if(!n)throw u;i["default"].isFunction(n)&&n(u,r)}}}function f(t,e,r){if(!t)return null;var f=n.copy(t);if(t.length)for(var o=0,u=f.length;u>o;o++){var c=f[o];try{f[o]=c?c(e):void 0}catch(a){if(f[o]=void 0,!r)throw a;i["default"].isFunction(r)&&r(a,o)}}return f}function o(t,e,i){r(n.copy(t),e,i)}e.unsafe=r,e.mapped=f,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o});
//# sourceMappingURL=Dispatch.js.map
