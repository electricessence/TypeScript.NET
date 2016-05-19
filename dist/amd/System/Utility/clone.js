/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,r,i){"use strict";function t(e,r){if(void 0===r&&(r=0),0>r)return e;if(!i.Type.isObject(e))return e;var f;if(Array.isArray(e)){if(f=e.slice(),r>0)for(var n=0;n<f.length;n++)f[n]=t(f[n],r-1)}else if(f={},r>0)for(var u in e)f[u]=t(e[u],r-1);return f}Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=t});
//# sourceMappingURL=clone.js.map
