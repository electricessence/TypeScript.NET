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
        define(["require", "exports", "../PromiseWrapper", "../../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PromiseWrapper_1 = require("../PromiseWrapper");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    /**
     * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
     * @param then
     * @returns {PromiseWrapper}
     */
    function createFrom(then) {
        if (!then)
            throw new ArgumentNullException_1.default("then");
        return new PromiseWrapper_1.default({ then: then });
    }
    exports.default = createFrom;
});
//# sourceMappingURL=createFrom.js.map