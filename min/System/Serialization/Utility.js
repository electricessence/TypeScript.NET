///<reference path="ISerializable.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types","../Exceptions/InvalidOperationException"],function(e,t,r,a){function i(e,t){var i=e;switch(typeof i){case r["default"].NULL:return r["default"].NULL;case r["default"].UNDEFINED:return r["default"].UNDEFINED;case r["default"].STRING:return i;case r["default"].BOOLEAN:return i?s:f;case r["default"].NUMBER:return n+i;default:if("serialize"in i&&typeof i.serialze==r["default"].FUNCTION)return i.serialize();if(arguments.length>1)return t;var u=new a["default"]("Attempting to serialize unidentifiable type.");throw u.data.value=i,u}}function u(e,t,a){if(e)switch(t&&(e=e.toLowerCase()),e){case r["default"].NULL:return null;case r["default"].UNDEFINED:return void 0;case s:return!0;case f:return!1;default:var i=e.replace(/^\s+|,|\s+$/g,n);if(i)if(/^\d+$/g.test(i)){var u=parseInt(i);if(!isNaN(u))return u}else{var l=parseFloat(e);if(!isNaN(l))return l}a&&(e=a(e))}return e}var n="",s="true",f="false";t.toString=i,t.toPrimitive=u});
//# sourceMappingURL=Utility.js.map
