/*!
 * @author electricessence / https://github.com/electricessence/
 * From Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}(function(e,t){"use strict";function r(e){return 32===e||e>=9&&e<=13||133===e||160===e}function i(e){return 65<=e&&e<=90||97<=e&&e<=122||e>=128&&133!==e&&160!==e}function n(e){return 48<=e&&e<=57||65<=e&&e<=90||97<=e&&e<=122||e>=128&&133!==e&&160!==e}function o(e,t){if(1==arguments.length)return 48<=e&&e<=57;var r=e.charCodeAt(t);return 48<=r&&r<=57}Object.defineProperty(t,"__esModule",{value:!0}),t.isWhiteSpace=r,t.isLetter=i,t.isLetterOrDigit=n,t.isDigit=o});
//# sourceMappingURL=Char.js.map