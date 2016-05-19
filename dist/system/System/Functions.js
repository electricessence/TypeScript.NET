/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Functions, rootFunctions;
    return {
        setters:[],
        execute: function() {
            Functions = (function () {
                function Functions() {
                }
                Functions.prototype.Identity = function (x) { return x; };
                Functions.prototype.True = function () { return true; };
                Functions.prototype.False = function () { return false; };
                Functions.prototype.Blank = function () { };
                return Functions;
            }());
            exports_1("Functions", Functions);
            rootFunctions = new Functions();
            (function (Functions) {
                Functions.Identity = rootFunctions.Identity;
                Functions.True = rootFunctions.True;
                Functions.False = rootFunctions.False;
                Functions.Blank = rootFunctions.Blank;
            })(Functions = Functions || (Functions = {}));
            exports_1("Functions", Functions);
            Object.freeze(Functions);
            exports_1("default",Functions);
        }
    }
});
//# sourceMappingURL=Functions.js.map