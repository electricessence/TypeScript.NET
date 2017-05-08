/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types"],function(e,t,r){"use strict";function n(e,t){if(void 0===t&&(t=!1),r.Type.isPropertyKey(e))return e;if(null===e)return o;if(e===i)return r.Type.UNDEFINED;if(r.Type.hasMethod(e,u))return e.getSymbol();if(r.Type.hasMethod(e,y))return e.getHashCode();if(t){if(r.Type.isFunction(t))return t(e);throw"Cannot create known identity."}return typeof e.toString==r.Type.FUNCTION?e.toString():Object.prototype.toString.call(e)}Object.defineProperty(t,"__esModule",{value:!0});var i=void 0,o="null",u="getSymbol",y="getHashCode";t.getIdentifier=n,t["default"]=n});
//# sourceMappingURL=getIdentifier.js.map