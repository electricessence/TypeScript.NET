/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Dictionaries/getIdentifier", "./HashSet"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var getIdentifier_1 = require("./Dictionaries/getIdentifier");
    var HashSet_1 = require("./HashSet");
    function getId(obj) {
        return getIdentifier_1.default(obj, typeof obj != "boolean" /* Boolean */);
    }
    var Set = /** @class */ (function (_super) {
        tslib_1.__extends(Set, _super);
        function Set(source) {
            return _super.call(this, source, getId) || this;
        }
        return Set;
    }(HashSet_1.HashSet));
    exports.default = Set;
});
//# sourceMappingURL=Set.js.map