/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types", "./Dictionaries/getIdentifier", "./HashSet", "../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var getIdentifier_1 = require("./Dictionaries/getIdentifier");
    var HashSet_1 = require("./HashSet");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var OTHER = 'other';
    var VOID0 = void 0;
    function getId(obj) {
        return getIdentifier_1.getIdentifier(obj, typeof obj != Types_1.Type.BOOLEAN);
    }
    var Set = (function (_super) {
        __extends(Set, _super);
        function Set(source) {
            _super.call(this, source, getId);
        }
        return Set;
    }(HashSet_1.HashSet));
    exports.Set = Set;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Set;
});
//# sourceMappingURL=Set.js.map