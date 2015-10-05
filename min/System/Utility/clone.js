/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,r,i){function n(e,r){if(void 0===r&&(r=0),0>r)return e;switch(typeof e){case i.UNDEFINED:case i.NULL:case i.STRING:case i.BOOLEAN:case i.NUMBER:case i.FUNCTION:return e}var s;if(e instanceof Array){if(s=e.slice(),r>0)for(var a=0;a<s.length;a++)s[a]=n(s[a],r-1)}else if(s={},r>0)for(var c in e)s[c]=n(e[c],r-1);return s}return n});
//# sourceMappingURL=clone.js.map
