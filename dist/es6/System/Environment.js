/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export function isCommonJS() {
    return !!(require && require.resolve);
}
export function isRequireJS() {
    return !!(require && require.toUrl && require.defined);
}
//# sourceMappingURL=Environment.js.map