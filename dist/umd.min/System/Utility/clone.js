!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var t=r(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../Types"],function(e,r){"use strict";function t(e,r){if(void 0===r&&(r=0),r<0)return e;if(!i.Type.isObject(e))return e;var o;if(e instanceof Array){if(o=e.slice(),r>0)for(var f=0;f<o.length;f++)o[f]=t(o[f],r-1)}else if(o={},r>0)for(var n in e)o[n]=t(e[n],r-1);return o}/*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
var i=e("../Types");Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=t});
//# sourceMappingURL=clone.js.map