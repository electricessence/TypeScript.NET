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
        define(["require", "exports", "./isPromise", "./wrap", "../Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isPromise_1 = require("./isPromise");
    var wrap_1 = require("./wrap");
    var Promise_1 = require("../Promise");
    function resolve(value) {
        return isPromise_1.default(value) ? wrap_1.default(value) : new Promise_1.Fulfilled(value);
    }
    exports.default = resolve;
});
//# sourceMappingURL=resolve.js.map