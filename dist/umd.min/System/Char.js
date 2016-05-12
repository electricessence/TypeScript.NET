/*!
 * @author electricessence / https://github.com/electricessence/
 * From Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}(function(e,t){"use strict";function i(e){return 32===e||e>=9&&13>=e||133===e||160===e}function r(e){return e>=65&&90>=e||e>=97&&122>=e||e>=128&&133!==e&&160!==e}function n(e){return e>=48&&57>=e||e>=65&&90>=e||e>=97&&122>=e||e>=128&&133!==e&&160!==e}function o(e,t){if(1==arguments.length)return e>=48&&57>=e;var i=e.charCodeAt(t);return i>=48&&57>=i}t.isWhiteSpace=i,t.isLetter=r,t.isLetterOrDigit=n,t.isDigit=o});
//# sourceMappingURL=Char.js.map
