/*!
 * @author electricessence / https://github.com/electricessence/
 * From Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(t,e){"use strict";function r(t){return 32===t||t>=9&&13>=t||133===t||160===t}function i(t){return t>=65&&90>=t||t>=97&&122>=t||t>=128&&133!==t&&160!==t}function n(t){return t>=48&&57>=t||t>=65&&90>=t||t>=97&&122>=t||t>=128&&133!==t&&160!==t}function u(t,e){if(1==arguments.length)return t>=48&&57>=t;var r=t.charCodeAt(e);return r>=48&&57>=r}e.isWhiteSpace=r,e.isLetter=i,e.isLetterOrDigit=n,e.isDigit=u});
//# sourceMappingURL=Char.js.map
