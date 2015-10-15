/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,r,t){function a(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return n(e,r)}function n(e,r){var a=r instanceof Array;return e.replace(/\{([^{}]*)\}/g,function(e,n){var u=n;if(a){var f=parseInt(n);isNaN(f)||(u=f)}var s=r[u];switch(typeof s){case t["default"].STRING:case t["default"].NUMBER:case t["default"].BOOLEAN:return s;default:return e}})}r.format=a,r.supplant=n});
//# sourceMappingURL=Utility.js.map
