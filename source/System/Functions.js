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
    var Functions = (function () {
        function Functions() {
        }
        Functions.prototype.Identity = function (x) { return x; };
        Functions.prototype.True = function () { return true; };
        Functions.prototype.False = function () { return false; };
        Functions.prototype.Blank = function () { };
        return Functions;
    }());
    exports.Functions = Functions;
    var rootFunctions = new Functions();
    var Functions;
    (function (Functions) {
        Functions.Identity = rootFunctions.Identity;
        Functions.True = rootFunctions.True;
        Functions.False = rootFunctions.False;
        Functions.Blank = rootFunctions.Blank;
    })(Functions = exports.Functions || (exports.Functions = {}));
    Object.freeze(Functions);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Functions;
});
//# sourceMappingURL=Functions.js.map