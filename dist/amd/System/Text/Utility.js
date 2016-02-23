/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(r,e,a){function n(r){return r.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function t(r,a,t){if(a){if(a===e.EMPTY)return r;var u=n(Array.isArray(a)?a.join():a);return r.replace(new RegExp("^["+u+"]+|["+u+"]+$","g"+(t?"i":"")),e.EMPTY)}return r.replace(/^\s+|\s+$/g,e.EMPTY)}function u(r){for(var e=[],a=1;a<arguments.length;a++)e[a-1]=arguments[a];return i(r,e)}function i(r,e){var n=Array.isArray(e);return r.replace(/\{([^{}]*)\}/g,function(r,t){var u=t;if(n){var i=parseInt(t);isNaN(i)||(u=i)}var f=e[u];switch(typeof f){case a["default"].STRING:case a["default"].NUMBER:case a["default"].BOOLEAN:return f;default:return r}})}e.EMPTY="",e.escapeRegExp=n,e.trim=t,e.format=u,e.supplant=i});
//# sourceMappingURL=Utility.js.map
