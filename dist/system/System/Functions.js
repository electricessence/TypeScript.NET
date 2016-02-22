System.register([], function(exports_1) {
    'use strict';
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
            rootFunctions = new Functions();
            (function (Functions) {
                Functions.Identity = rootFunctions.Identity;
                Functions.True = rootFunctions.True;
                Functions.False = rootFunctions.False;
                Functions.Blank = rootFunctions.Blank;
            })(Functions || (Functions = {}));
            Object.freeze(Functions);
            exports_1("default",Functions);
        }
    }
});
//# sourceMappingURL=Functions.js.map