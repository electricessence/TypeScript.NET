/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,r,n){function t(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function a(e,n,a){if(n){if(n===r.EMPTY)return e;var u=t(n instanceof Array?n.join():n);return e.replace(new RegExp("^["+u+"]+|["+u+"]+$","g"+(a?"i":"")),r.EMPTY)}return e.replace(/^\s+|\s+$/g,r.EMPTY)}function u(e){for(var r=[],n=1;n<arguments.length;n++)r[n-1]=arguments[n];return f(e,r)}function f(e,r){var t=r instanceof Array;return e.replace(/\{([^{}]*)\}/g,function(e,a){var u=a;if(t){var f=parseInt(a);isNaN(f)||(u=f)}var i=r[u];switch(typeof i){case n["default"].STRING:case n["default"].NUMBER:case n["default"].BOOLEAN:return i;default:return e}})}r.EMPTY="",r.escapeRegExp=t,r.trim=a,r.format=u,r.supplant=f});
//# sourceMappingURL=Utility.js.map
