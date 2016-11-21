!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var i=t(require,exports);void 0!==i&&(module.exports=i)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","../../Types","./Utility"],function(e,t){"use strict";function i(e,t,i){if(e&&e.length)for(var o=0,r=e.length;o<r;o++){var f=e[o];if(f)try{f(t)}catch(u){if(!i)throw u;n.Type.isFunction(i)&&i(u,o)}}}function o(e,t,i){if(!e)return e;var o=f.copy(e);if(e.length)for(var r=0,c=o.length;r<c;r++){var p=o[r];try{o[r]=p?p(t):u}catch(a){if(o[r]=u,!i)throw a;n.Type.isFunction(i)&&i(a,r)}}return o}function r(e,t,o){i(f.copy(e),t,o)}/*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
var n=e("../../Types"),f=e("./Utility"),u=void 0;t.unsafe=i,t.mapped=o,t.dispatch=r,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=Dispatch.js.map