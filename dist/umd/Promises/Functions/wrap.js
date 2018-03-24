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
        define(["require", "exports", "./isPromise", "../PromiseBase", "../PromiseWrapper", "../Promise", "../../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isPromise_1 = require("./isPromise");
    var PromiseBase_1 = require("../PromiseBase");
    var PromiseWrapper_1 = require("../PromiseWrapper");
    var Promise_1 = require("../Promise");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    /**
     * Takes any Promise-Like object and ensures an extended version of it from this module.
     * @param target The Promise-Like object
     * @returns A new target that simply extends the target.
     */
    function wrap(target) {
        if (!target)
            throw new ArgumentNullException_1.default("target");
        return isPromise_1.default(target)
            ? (target instanceof PromiseBase_1.default ? target : new PromiseWrapper_1.default(target))
            : new Promise_1.Fulfilled(target);
    }
    exports.default = wrap;
});
//# sourceMappingURL=wrap.js.map