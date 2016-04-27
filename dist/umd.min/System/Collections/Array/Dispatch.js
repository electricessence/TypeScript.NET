/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../../Types","./Utility"],e)}(function(e,t){"use strict";function i(e,t,i){if(e&&e.length)for(var o=0,n=e.length;n>o;o++){var f=e[o];if(f)try{f(t)}catch(u){if(!i)throw u;r["default"].isFunction(i)&&i(u,o)}}}function o(e,t,i){if(!e)return null;var o=f.copy(e);if(e.length)for(var n=0,c=o.length;c>n;n++){var a=o[n];try{o[n]=a?a(t):u}catch(l){if(o[n]=u,!i)throw l;r["default"].isFunction(i)&&i(l,n)}}return o}function n(e,t,o){i(f.copy(e),t,o)}var r=e("../../Types"),f=e("./Utility"),u=void 0;t.unsafe=i,t.mapped=o,t.dispatch=n,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=Dispatch.js.map
