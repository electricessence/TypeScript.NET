/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./IndexEnumerator","../../Types","../../../extends"],e)}(function(e,t){"use strict";var n=e("./IndexEnumerator"),o=e("../../Types"),r=e("../../../extends"),u=r["default"],i=function(e){function t(t,n,r){void 0===n&&(n=0),void 0===r&&(r=1),e.call(this,function(){var e=o.Type.isFunction(t)?t():t;return{source:e,pointer:n,length:e?e.length:0,step:r}})}return u(t,e),t}(n.IndexEnumerator);t.ArrayEnumerator=i,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=ArrayEnumerator.js.map
