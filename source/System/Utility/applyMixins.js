/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    function applyMixins(derivedConstructor, baseConstructors) {
        baseConstructors
            .forEach(function (bc) {
            Object.getOwnPropertyNames(bc.prototype).forEach(function (name) {
                derivedConstructor.prototype[name] = bc.prototype[name];
            });
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = applyMixins;
});
//# sourceMappingURL=applyMixins.js.map