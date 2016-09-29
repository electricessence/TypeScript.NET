/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","./Utility"],function(t,e,i,r){"use strict";function n(t,e,r){if(t&&t.length)for(var n=0,f=t.length;n<f;n++){var o=t[n];if(o)try{o(e)}catch(c){if(!r)throw c;i.Type.isFunction(r)&&r(c,n)}}}function f(t,e,n){if(!t)return t;var f=r.copy(t);if(t.length)for(var o=0,u=f.length;o<u;o++){var a=f[o];try{f[o]=a?a(e):c}catch(p){if(f[o]=c,!n)throw p;i.Type.isFunction(n)&&n(p,o)}}return f}function o(t,e,i){n(r.copy(t),e,i)}var c=void 0;e.unsafe=n,e.mapped=f,e.dispatch=o,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o});
//# sourceMappingURL=Dispatch.js.map