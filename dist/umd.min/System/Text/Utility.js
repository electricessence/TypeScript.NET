/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var t=r(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports","../Types"],function(e,r){function t(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function n(e,n,a){if(n){if(n===r.EMPTY)return e;var u=t(n instanceof Array?n.join():n);return e.replace(new RegExp("^["+u+"]+|["+u+"]+$","g"+(a?"i":"")),r.EMPTY)}return e.replace(/^\s+|\s+$/g,r.EMPTY)}function a(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return u(e,r)}function u(e,r){var t=r instanceof Array;return e.replace(/\{([^{}]*)\}/g,function(e,n){var a=n;if(t){var u=parseInt(n);isNaN(u)||(a=u)}var o=r[a];switch(typeof o){case f["default"].STRING:case f["default"].NUMBER:case f["default"].BOOLEAN:return o;default:return e}})}var f=e("../Types");r.EMPTY="",r.escapeRegExp=t,r.trim=n,r.format=a,r.supplant=u});
//# sourceMappingURL=Utility.js.map
