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
        define(["require", "exports", "../../Exceptions/ArgumentNullException", "../PromiseCollection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var PromiseCollection_1 = require("../PromiseCollection");
    function group(first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!first && !rest.length)
            throw new ArgumentNullException_1.default("promises");
        return new PromiseCollection_1.default(((first) instanceof (Array) ? first : [first])
            .concat(rest));
    }
    exports.default = group;
});
//# sourceMappingURL=group.js.map