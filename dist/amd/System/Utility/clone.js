/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,r,i){function f(e,r){if(void 0===r&&(r=0),0>r)return e;if(!i["default"].isObject(e))return e;var n;if(e instanceof Array){if(n=e.slice(),r>0)for(var t=0;t<n.length;t++)n[t]=f(n[t],r-1)}else if(n={},r>0)for(var u in e)n[u]=f(e[u],r-1);return n}Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=f});
//# sourceMappingURL=clone.js.map
