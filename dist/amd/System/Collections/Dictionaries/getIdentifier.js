/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types"],function(e,t,r){"use strict";function n(e,t){if(void 0===t&&(t=!1),r.Type.isPropertyKey(e))return e;if(null===e)return i;if(e===o)return r.Type.UNDEFINED;if(r.Type.hasMethod(e,u))return e.getSymbol();if(r.Type.hasMethod(e,y))return e.getHashCode();if(t)throw"Cannot create known identity.";return typeof e.toString==r.Type.FUNCTION?e.toString():Object.prototype.toString.call(e)}var o=void 0,i="null",u="getSymbol",y="getHashCode";t.getIdentifier=n,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=getIdentifier.js.map