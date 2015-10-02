/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports"], function (require, exports) {
    var Functions = (function () {
        function Functions() {
        }
        Functions.prototype.Identity = function (x) { return x; };
        Functions.prototype.True = function () { return true; };
        Functions.prototype.False = function () { return false; };
        Functions.prototype.Blank = function () { };
        Object.defineProperty(Functions, "Identity", {
            get: function () {
                return rootFunctions.Identity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Functions, "True", {
            get: function () {
                return rootFunctions.True;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Functions, "False", {
            get: function () {
                return rootFunctions.False;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Functions, "Blank", {
            get: function () {
                return rootFunctions.Blank;
            },
            enumerable: true,
            configurable: true
        });
        return Functions;
    })();
    var rootFunctions = new Functions();
    return Functions;
});
//# sourceMappingURL=Functions.js.map