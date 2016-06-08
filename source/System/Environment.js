/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.isCommonJS = !!(require && require.resolve);
    exports.isRequireJS = !!(require && require.toUrl && require.defined);
    exports.isNodeJS = typeof process == "object"
        && process.toString() === "[object process]"
        && process.nextTick != void 0;
    Object.freeze(exports);
});
//# sourceMappingURL=Environment.js.map