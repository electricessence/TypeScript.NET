/*!
 * @author electricessence / https://github.com/electricessence/
 * From Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(t,e){"use strict";function r(t){return 32===t||t>=9&&t<=13||133===t||160===t}function i(t){return 65<=t&&t<=90||97<=t&&t<=122||t>=128&&133!==t&&160!==t}function n(t){return 48<=t&&t<=57||65<=t&&t<=90||97<=t&&t<=122||t>=128&&133!==t&&160!==t}function u(t,e){if(1==arguments.length)return 48<=t&&t<=57;var r=t.charCodeAt(e);return 48<=r&&r<=57}e.isWhiteSpace=r,e.isLetter=i,e.isLetterOrDigit=n,e.isDigit=u});
//# sourceMappingURL=Char.js.map