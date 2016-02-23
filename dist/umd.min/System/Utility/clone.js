/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports","../Types"],e)}(function(e,r){function i(e,r){if(void 0===r&&(r=0),0>r)return e;if(!o["default"].isObject(e))return e;var t;if(Array.isArray(e)){if(t=e.slice(),r>0)for(var f=0;f<t.length;f++)t[f]=i(t[f],r-1)}else if(t={},r>0)for(var n in e)t[n]=i(e[n],r-1);return t}var o=e("../Types");Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=i});
//# sourceMappingURL=clone.js.map
