/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(r,e,t){"use strict";function a(r){return r.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function n(r,t,n){if(t){if(t===e.EMPTY)return r;var u=a(Array.isArray(t)?t.join():t);return r.replace(new RegExp("^["+u+"]+|["+u+"]+$","g"+(n?"i":"")),e.EMPTY)}return r.replace(/^\s+|\s+$/g,e.EMPTY)}function u(r){for(var e=[],t=1;t<arguments.length;t++)e[t-1]=arguments[t];return i(r,e)}function i(r,e){var a=Array.isArray(e);return r.replace(/\{([^{}]*)\}/g,function(r,n){var u=n;if(a){var i=parseInt(n);isNaN(i)||(u=i)}var f=e[u];switch(typeof f){case t["default"].STRING:case t["default"].NUMBER:case t["default"].BOOLEAN:return f;default:return r}})}e.EMPTY="",e.escapeRegExp=a,e.trim=n,e.format=u,e.supplant=i});
//# sourceMappingURL=Utility.js.map
