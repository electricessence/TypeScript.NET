/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types","../Exceptions/InvalidOperationException"],function(e,t,r,a){function i(e,t){var i=e;switch(typeof i){case r["default"].UNDEFINED:case r["default"].STRING:return i;case r["default"].BOOLEAN:return i?s:l;case r["default"].NUMBER:return u+i;default:if(null===i)return i;if(r["default"].of(i).member("serialize").isFunction)return i.serialize();if(arguments.length>1)return t;var n=new a["default"]("Attempting to serialize unidentifiable type.");throw n.data.value=i,n}}function n(e,t,a){if(e)switch(t&&(e=e.toLowerCase()),e){case"null":return null;case r["default"].UNDEFINED:return void 0;case s:return!0;case l:return!1;default:var i=e.replace(/^\s+|,|\s+$/g,u);if(i)if(/^\d+$/g.test(i)){var n=parseInt(i);if(!isNaN(n))return n}else{var f=parseFloat(e);if(!isNaN(f))return f}a&&(e=a(e))}return e}var u="",s="true",l="false";t.toString=i,t.toPrimitive=n});
//# sourceMappingURL=Utility.js.map
