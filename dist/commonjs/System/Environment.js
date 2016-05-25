/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

function isCommonJS() {
    return !!(require && require.resolve);
}
exports.isCommonJS = isCommonJS;
function isRequireJS() {
    return !!(require && require.toUrl && require.defined);
}
exports.isRequireJS = isRequireJS;
//# sourceMappingURL=Environment.js.map
