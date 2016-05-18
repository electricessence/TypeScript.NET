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
    function shallowCopy(source, target) {
        if (target === void 0) { target = {}; }
        if (target) {
            for (var k in source) {
                target[k] = source[k];
            }
        }
        return target;
    }
    exports.shallowCopy = shallowCopy;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = shallowCopy;
});
//# sourceMappingURL=shallowCopy.js.map