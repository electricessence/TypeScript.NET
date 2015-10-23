/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var o=r(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../Types"],function(e,r){function o(e,r){if(void 0===r&&(r=0),0>r)return e;if(!t["default"].isObject(e))return e;var f;if(e instanceof Array){if(f=e.slice(),r>0)for(var i=0;i<f.length;i++)f[i]=o(f[i],r-1)}else if(f={},r>0)for(var n in e)f[n]=o(e[n],r-1);return f}var t=e("../Types");Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=o});
//# sourceMappingURL=clone.js.map
