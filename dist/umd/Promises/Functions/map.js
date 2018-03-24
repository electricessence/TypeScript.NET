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
        define(["require", "exports", "../Promise", "../PromiseCollection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise_1 = require("../Promise");
    var PromiseCollection_1 = require("../PromiseCollection");
    /**
     * Creates a PromiseCollection containing promises that will resolve on the next tick using the transform function.
     * This utility function does not chain promises together to create the result,
     * it only uses one promise per transform.
     * @param source
     * @param transform
     * @returns {PromiseCollection}
     */
    function map(source, transform) {
        return new PromiseCollection_1.default(source.map(function (d) { return new Promise_1.default(function (r, j) {
            try {
                r(transform(d));
            }
            catch (ex) {
                j(ex);
            }
        }); }));
    }
    exports.default = map;
});
//# sourceMappingURL=map.js.map