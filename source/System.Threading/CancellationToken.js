/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports"], function (require, exports) {
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
    return CancellationToken;
});
//# sourceMappingURL=CancellationToken.js.map