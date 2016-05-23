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
    function isCommonJS() {
        return !!(require && require.resolve);
    }
    exports.isCommonJS = isCommonJS;
    function isRequireJS() {
        return !!(require && require.toUrl && require.defined);
    }
    exports.isRequireJS = isRequireJS;
});
//# sourceMappingURL=Environment.js.map