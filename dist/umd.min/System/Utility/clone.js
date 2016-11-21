!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var i=r(require,exports);void 0!==i&&(module.exports=i)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../Types"],function(e,r){"use strict";function i(e,r){if(void 0===r&&(r=0),r<0)return e;if(!t.Type.isObject(e))return e;var o;if(Array.isArray(e)){if(o=e.slice(),r>0)for(var f=0;f<o.length;f++)o[f]=i(o[f],r-1)}else if(o={},r>0)for(var n in e)o[n]=i(e[n],r-1);return o}/*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
var t=e("../Types");Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=i});
//# sourceMappingURL=clone.js.map