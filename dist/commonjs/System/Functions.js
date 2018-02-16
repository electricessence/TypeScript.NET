"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Can be used statically or extended for varying different reusable function signatures.
 */
var Functions = /** @class */ (function () {
    function Functions() {
    }
    //noinspection JSMethodCanBeStatic
    /**
     * A typed method for use with simple selection of the parameter.
     * @returns {T}
     */
    Functions.prototype.Identity = function (x) { return x; };
    //noinspection JSMethodCanBeStatic
    /**
     * Returns true.
     * @returns {boolean}
     */
    Functions.prototype.True = function () { return true; };
    //noinspection JSMethodCanBeStatic
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
}());
exports.Functions = Functions;
var rootFunctions = new Functions();
// Expose static versions.
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
})(Functions = exports.Functions || (exports.Functions = {}));
exports.Functions = Functions;
// Make this read only.  Should still allow for sub-classing since extra methods are added to prototype.
Object.freeze(Functions);
exports.default = Functions;
//# sourceMappingURL=Functions.js.map