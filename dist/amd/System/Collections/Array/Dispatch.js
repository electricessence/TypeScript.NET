/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","./Utility"],function(t,e,i,n){"use strict";function r(t,e,n){if(t&&t.length)for(var r=0,f=t.length;f>r;r++){var o=t[r];if(o)try{o(e)}catch(c){if(!n)throw c;i.Type.isFunction(n)&&n(c,r)}}}function f(t,e,r){if(!t)return null;var f=n.copy(t);if(t.length)for(var o=0,u=f.length;u>o;o++){var a=f[o];try{f[o]=a?a(e):c}catch(l){if(f[o]=c,!r)throw l;i.Type.isFunction(r)&&r(l,o)}}return f}function o(t,e,i){r(n.copy(t),e,i)}var c=void 0;e.unsafe=r,e.mapped=f,e.dispatch=o,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o});
//# sourceMappingURL=Dispatch.js.map
