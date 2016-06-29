/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
const r = eval('require');
export const isCommonJS = !!(r && r.resolve);
export const isRequireJS = !!(r && r.toUrl && r.defined);
export const isNodeJS = typeof process == "object"
    && process.toString() === "[object process]"
    && process.nextTick != void 0;
Object.freeze(exports);
//# sourceMappingURL=Environment.js.map