/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./Exceptions/ArgumentException","./Exceptions/ArgumentNullException"],function(e,t,n,r){"use strict";function u(e){return e&&e.hasOwnProperty(d)&&e.hasOwnProperty(c)}function i(e,t){if(void 0===t&&(t=p),a(e,t+s+d),null===e)throw new r["default"](t+s+d);return e}function o(e,t){if(void 0===t&&(t=p),2!=e.length)throw new n["default"](t,"KeyValuePair tuples must be of length 2.");i(e[0],t)}function a(e,t){if(e===f)throw new n["default"](t,v);return e}function l(e,t){var r,l;if(e instanceof Array)o(e),r=e[0],l=a(e[1],y);else{if(!u(e))throw new n["default"](p,h);r=i(e.key),l=a(e.value,w)}return t(r,l)}var f=void 0,s=".",d="key",c="value",p="item",y=p+"[1]",w=p+s+c,h="Invalid type.  Must be a KeyValuePair or Tuple of length 2.",v="Cannot equal undefined.";t.isKeyValuePair=u,t.assertKey=i,t.assertTuple=o,t.assertNotUndefined=a,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=l});
//# sourceMappingURL=KeyValueExtract.js.map
