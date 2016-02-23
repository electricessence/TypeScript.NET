/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,r,i){function f(e,r){if(void 0===r&&(r=0),0>r)return e;if(!i["default"].isObject(e))return e;var t;if(Array.isArray(e)){if(t=e.slice(),r>0)for(var n=0;n<t.length;n++)t[n]=f(t[n],r-1)}else if(t={},r>0)for(var u in e)t[u]=f(e[u],r-1);return t}Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=f});
//# sourceMappingURL=clone.js.map
