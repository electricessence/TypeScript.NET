!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var o=r(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../Types","../Collections/Array/copy"],function(e,r){"use strict";function o(e,r){if(void 0===r&&(r=0),r<0)return e;if(!t.Type.isObject(e))return e;if(t.Type.isArrayLike(e)){var f=i.copy(e);if(r>0)for(var n=e.length,u=0;u<n;u++)f[u]=o(f[u],r-1);return f}var f={};if(r>0)for(var p in e)f[p]=o(e[p],r-1);return f}/*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
var t=e("../Types"),i=e("../Collections/Array/copy");Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=o});
//# sourceMappingURL=clone.js.map