/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)};!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./IndexEnumerator","../../Types"],e)}(function(e,t){"use strict";var n=e("./IndexEnumerator"),o=e("../../Types"),r=function(e){function t(t,n,r){void 0===n&&(n=0),void 0===r&&(r=1),e.call(this,function(){var e=o.Type.isFunction(t)?t():t;return{source:e,pointer:n,length:e?e.length:0,step:r}})}return __extends(t,e),t}(n.IndexEnumerator);t.ArrayEnumerator=r,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=ArrayEnumerator.js.map
