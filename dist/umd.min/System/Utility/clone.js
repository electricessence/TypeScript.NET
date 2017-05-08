/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports","../Types","../Collections/Array/copy"],e)}(function(e,r){"use strict";function o(e,r){if(void 0===r&&(r=0),r<0)return e;if(!t.Type.isObject(e))return e;if(t.Type.isArrayLike(e)){var f=i.copy(e);if(r>0)for(var n=e.length,u=0;u<n;u++)f[u]=o(f[u],r-1);return f}var f={};if(r>0)for(var p in e)f[p]=o(e[p],r-1);return f}Object.defineProperty(r,"__esModule",{value:!0});var t=e("../Types"),i=e("../Collections/Array/copy");r["default"]=o});
//# sourceMappingURL=clone.js.map