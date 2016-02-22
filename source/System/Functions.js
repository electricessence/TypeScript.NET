/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict'; // For compatibility with (let, const, function, class);
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    /**
     * Can be used statically or extended for varying different reusable function signatures.
     */
    var Functions = (function () {
        function Functions() {
        }
        /**
         * A typed method for use with simple selection of the parameter.
         * @returns {T}
         */
        Functions.prototype.Identity = function (x) { return x; };
        /**
         * Returns true.
         * @returns {boolean}
         */
        Functions.prototype.True = function () { return true; };
        /**
         * Returns false.
         * @returns {boolean}
         */
        Functions.prototype.False = function () { return false; };
        /**
         * Does nothing.
         */
        Functions.prototype.Blank = function () { };
        return Functions;
    })();
    var rootFunctions = new Functions();
    // Expose static versions.
    var Functions;
    (function (Functions) {
        /**
         * A typed method for use with simple selection of the parameter.
         * @returns {boolean}
         */
        Functions.Identity = rootFunctions.Identity;
        /**
         * Returns false.
         * @returns {boolean}
         */
        Functions.True = rootFunctions.True;
        /**
         * Returns false.
         * @returns {boolean}
         */
        Functions.False = rootFunctions.False;
        /**
         * Does nothing.
         */
        Functions.Blank = rootFunctions.Blank;
    })(Functions || (Functions = {}));
    // Make this read only.  Should still allow for sub-classing since extra methods are added to prototype.
    Object.freeze(Functions);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Functions;
});
//# sourceMappingURL=Functions.js.map