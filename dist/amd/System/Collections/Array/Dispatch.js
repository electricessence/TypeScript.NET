/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","./copy"],function(t,e,n,i){"use strict";function r(t,e,n){r.unsafe(i.copy(t),e,n)}Object.defineProperty(e,"__esModule",{value:!0});var c=void 0;e.dispatch=r,function(t){function e(t,e,i){if(t&&t.length)for(var r=0,c=t.length;r<c;r++){var f=t[r];if(f)try{f(e)}catch(o){if(!i)throw o;n.Type.isFunction(i)&&i(o,r)}}}function r(t,e,r){if(!t)return t;var f=i.copy(t);if(t.length)for(var o=0,a=f.length;o<a;o++){var u=f[o];try{f[o]=u?u(e):c}catch(p){if(f[o]=c,!r)throw p;n.Type.isFunction(r)&&r(p,o)}}return f}t.unsafe=e,t.mapped=r}(r=e.dispatch||(e.dispatch={})),e["default"]=r});
//# sourceMappingURL=Dispatch.js.map