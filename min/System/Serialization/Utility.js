///<reference path="ISerializable.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types","../Exceptions/InvalidOperationException"],function(e,r,t,i){function a(e,r){var a=e;switch(typeof a){case t.NULL:return t.NULL;case t.UNDEFINED:return t.UNDEFINED;case t.STRING:return a;case t.BOOLEAN:return a?u:N;case t.NUMBER:return s+a;default:if("serialize"in a&&typeof a.serialze==t.FUNCTION)return a.serialize();if(arguments.length>1)return r;var n=new i("Attempting to serialize unidentifiable type.");throw n.data.value=a,n}}function n(e,r,i){if(e)switch(r&&(e=e.toLowerCase()),e){case t.NULL:return null;case t.UNDEFINED:return void 0;case u:return!0;case N:return!1;default:var a=e.replace(/^\s+|,|\s+$/g,s);if(a)if(/^\d+$/g.test(a)){var n=parseInt(a);if(!isNaN(n))return n}else{var c=parseFloat(e);if(!isNaN(c))return c}i&&(e=i(e))}return e}var s="",u="true",N="false";r.toString=a,r.toPrimitive=n});
//# sourceMappingURL=Utility.js.map
