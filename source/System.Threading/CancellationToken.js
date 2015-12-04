/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
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
    var noneToken = new CancellationToken();
    Object.freeze(noneToken);
    var CancellationToken = (function () {
        function CancellationToken() {
        }
        Object.defineProperty(CancellationToken, "none", {
            get: function () {
                return noneToken;
            },
            enumerable: true,
            configurable: true
        });
        return CancellationToken;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CancellationToken;
});
//# sourceMappingURL=CancellationToken.js.map