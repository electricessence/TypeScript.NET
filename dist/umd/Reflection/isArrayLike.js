/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./hasMember"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasMember_1 = require("./hasMember");
    var LENGTH = "length";
    function isArrayLike(instance) {
        var type = typeof instance;
        /*
         * NOTE:
         *
         * Functions:
         * Enumerating a function although it has a .length property will yield nothing or unexpected results.
         * Effectively, a function is not like an array.
         *
         * Strings:
         * Behave like arrays but don't have the same exact methods.
         */
        return instance instanceof Array
            || type == "string" /* String */
            || type == "function" /* Function */ && hasMember_1.default(instance, LENGTH);
    }
    exports.default = isArrayLike;
});
//# sourceMappingURL=isArrayLike.js.map