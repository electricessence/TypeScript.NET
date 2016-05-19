/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./Exceptions/ArgumentException","./Exceptions/ArgumentNullException"],function(e,t,n,r){"use strict";function u(e){return e&&e.hasOwnProperty(c)&&e.hasOwnProperty(p)}function i(e,t){if(void 0===t&&(t=d),a(e,t+f+c),null===e)throw new r.ArgumentNullException(t+f+c);return e}function o(e,t){if(void 0===t&&(t=d),2!=e.length)throw new n.ArgumentException(t,"KeyValuePair tuples must be of length 2.");i(e[0],t)}function a(e,t){if(e===s)throw new n.ArgumentException(t,g);return e}function l(e,t){var r,l;if(e instanceof Array)o(e),r=e[0],l=a(e[1],y);else{if(!u(e))throw new n.ArgumentException(d,x);r=i(e.key),l=a(e.value,w)}return t(r,l)}var s=void 0,f=".",c="key",p="value",d="item",y=d+"[1]",w=d+f+p,x="Invalid type.  Must be a KeyValuePair or Tuple of length 2.",g="Cannot equal undefined.";t.isKeyValuePair=u,t.assertKey=i,t.assertTuple=o,t.assertNotUndefined=a,t.extractKeyValue=l,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=l});
//# sourceMappingURL=KeyValueExtract.js.map
