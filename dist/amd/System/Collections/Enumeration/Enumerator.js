/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","./ArrayEnumerator","./IndexEnumerator"],function(e,r,t,n,u){"use strict";function o(e){if(!e)return c;if(Array.isArray(e))return new n["default"](e);if(!t["default"].isPrimitive(e)){if(t["default"].isArrayLike(e))return new u["default"](function(){return{source:e,length:e.length,pointer:0,step:1}});if(i(e))return e.getEnumerator()}throw new Error("Unknown enumerable.")}function i(e){return t["default"].hasMemberOfType(e,"getEnumerator",t["default"].FUNCTION)}function f(e,r){if(e)for(var t=0;e.moveNext()&&r(e.current,t++)!==!1;);}var a=function(){function e(){}return Object.defineProperty(e.prototype,"current",{get:function(){},enumerable:!0,configurable:!0}),e.prototype.moveNext=function(){return!1},e.prototype.reset=function(){},e.prototype.dispose=function(){},e}(),c=new a;r.from=o,r.isEnumerable=i,r.forEach=f});
//# sourceMappingURL=Enumerator.js.map
