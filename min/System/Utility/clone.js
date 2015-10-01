/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,r,n){function i(e,r){if(void 0===r&&(r=0),0>r)return e;switch(typeof e){case n.Undefined:case n.Null:case n.String:case n.Boolean:case n.Number:case n.Function:return e}var t;if(e instanceof Array){if(t=e.slice(),r>0)for(var a=0;a<t.length;a++)t[a]=i(t[a],r-1)}else if(t={},r>0)for(var c in e)t[c]=i(e[c],r-1);return t}return i});
//# sourceMappingURL=clone.js.map
