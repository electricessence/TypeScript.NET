/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Functions, rootFunctions;
    return {
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            /**
             * Can be used statically or extended for varying different reusable function signatures.
             */
            Functions = /** @class */ (function () {
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
            exports_1("Functions", Functions);
            rootFunctions = new Functions();
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
            })(Functions || (Functions = {}));
            exports_1("Functions", Functions);
            // Make this read only.  Should still allow for sub-classing since extra methods are added to prototype.
            Object.freeze(Functions);
            exports_1("default", Functions);
        }
    };
});
//# sourceMappingURL=Functions.js.map