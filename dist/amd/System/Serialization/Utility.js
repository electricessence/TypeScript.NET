/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types","../Exceptions/InvalidOperationException"],function(e,t,r,a){"use strict";function i(e,t){var i=e;switch(typeof i){case r["default"].UNDEFINED:case r["default"].STRING:return i;case r["default"].BOOLEAN:return i?l:f;case r["default"].NUMBER:return s+i;default:if(null===i)return i;if(n(i))return i.serialize();if(arguments.length>1)return t;var u=new a["default"]("Attempting to serialize unidentifiable type.");throw u.data.value=i,u}}function n(e){return r["default"].hasMemberOfType(e,"serialize",r["default"].FUNCTION)}function u(e,t,a){if(e)switch(t&&(e=e.toLowerCase()),e){case"null":return null;case r["default"].UNDEFINED:return;case l:return!0;case f:return!1;default:var i=e.replace(/^\s+|,|\s+$/g,s);if(i)if(/^\d+$/g.test(i)){var n=parseInt(i);if(!isNaN(n))return n}else{var u=parseFloat(e);if(!isNaN(u))return u}a&&(e=a(e))}return e}var s="",l="true",f="false";t.toString=i,t.isSerializable=n,t.toPrimitive=u});
//# sourceMappingURL=Utility.js.map
