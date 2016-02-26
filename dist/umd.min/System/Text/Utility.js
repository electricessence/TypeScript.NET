/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports","../Types"],e)}(function(e,r){"use strict";function t(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function n(e,n,a){if(n){if(n===r.EMPTY)return e;var u=t(Array.isArray(n)?n.join():n);return e.replace(new RegExp("^["+u+"]+|["+u+"]+$","g"+(a?"i":"")),r.EMPTY)}return e.replace(/^\s+|\s+$/g,r.EMPTY)}function a(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return u(e,r)}function u(e,r){var t=Array.isArray(r);return e.replace(/\{([^{}]*)\}/g,function(e,n){var a=n;if(t){var u=parseInt(n);isNaN(u)||(a=u)}var f=r[a];switch(typeof f){case i["default"].STRING:case i["default"].NUMBER:case i["default"].BOOLEAN:return f;default:return e}})}var i=e("../Types");r.EMPTY="",r.escapeRegExp=t,r.trim=n,r.format=a,r.supplant=u});
//# sourceMappingURL=Utility.js.map
