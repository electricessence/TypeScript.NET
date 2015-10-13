/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,a,f){function t(e,a){if(void 0===a&&(a=0),0>a)return e;switch(typeof e){case f["default"].UNDEFINED:case f["default"].NULL:case f["default"].STRING:case f["default"].BOOLEAN:case f["default"].NUMBER:case f["default"].FUNCTION:return e}var r;if(e instanceof Array){if(r=e.slice(),a>0)for(var u=0;u<r.length;u++)r[u]=t(r[u],a-1)}else if(r={},a>0)for(var i in e)r[i]=t(e[i],a-1);return r}Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=t});
//# sourceMappingURL=clone.js.map
