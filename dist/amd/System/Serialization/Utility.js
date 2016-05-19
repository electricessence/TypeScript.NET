/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types","../Exceptions/InvalidOperationException"],function(e,r,t,i){"use strict";function n(e,r){var n=e;switch(typeof n){case t.Type.UNDEFINED:case t.Type.STRING:return n;case t.Type.BOOLEAN:return n?l:p;case t.Type.NUMBER:return u+n;default:if(null===n)return n;if(a(n))return n.serialize();if(arguments.length>1)return r;var s=new i.InvalidOperationException("Attempting to serialize unidentifiable type.");throw s.data.value=n,s}}function a(e){return t.Type.hasMemberOfType(e,"serialize",t.Type.FUNCTION)}function s(e,r,i){if(e)switch(r&&(e=e.toLowerCase()),e){case"null":return null;case t.Type.UNDEFINED:return;case l:return!0;case p:return!1;default:var n=e.replace(/^\s+|,|\s+$/g,u);if(n)if(/^\d+$/g.test(n)){var a=parseInt(n);if(!isNaN(a))return a}else{var s=parseFloat(e);if(!isNaN(s))return s}i&&(e=i(e))}return e}var u="",l="true",p="false";r.toString=n,r.isSerializable=a,r.toPrimitive=s});
//# sourceMappingURL=Utility.js.map
