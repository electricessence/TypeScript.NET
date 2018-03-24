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
        define(["require", "exports", "../PromiseBase", "./wrap", "../Promise", "../../Exceptions/ArgumentException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PromiseBase_1 = require("../PromiseBase");
    var wrap_1 = require("./wrap");
    var Promise_1 = require("../Promise");
    var ArgumentException_1 = require("../../Exceptions/ArgumentException");
    function race(first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var promises = first && ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copyArray?
        if (!promises || !promises.length || !(promises = promises.filter(function (v) { return v != null; })).length)
            throw new ArgumentException_1.default("Nothing to wait for.");
        var len = promises.length;
        // Only one?  Nothing to race.
        if (len == 1)
            return wrap_1.default(promises[0]);
        // Look for already resolved promises and the first one wins.
        for (var i = 0; i < len; i++) {
            var p = promises[i];
            if (p instanceof PromiseBase_1.default && p.isSettled)
                return p;
        }
        return new Promise_1.default(function (resolve, reject) {
            var cleanup = function () {
                reject = null;
                resolve = null;
                promises.length = 0;
                promises = null;
            };
            var onResolve = function (r, v) {
                if (r) {
                    cleanup();
                    r(v);
                }
            };
            var onFulfill = function (v) { return onResolve(resolve, v); };
            var onReject = function (e) { return onResolve(reject, e); };
            for (var _i = 0, promises_1 = promises; _i < promises_1.length; _i++) {
                var p = promises_1[_i];
                if (!resolve)
                    break;
                p.then(onFulfill, onReject);
            }
        });
    }
    exports.default = race;
});
//# sourceMappingURL=race.js.map