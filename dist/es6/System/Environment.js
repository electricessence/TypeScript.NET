/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export const isCommonJS = !!(require && require.resolve);
export const isRequireJS = !!(require && require.toUrl && require.defined);
export const isNodeJS = typeof process == "object"
    && process.toString() === "[object process]"
    && process.nextTick != void 0;
Object.freeze(exports);
//# sourceMappingURL=Environment.js.map