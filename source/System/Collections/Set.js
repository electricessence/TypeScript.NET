(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "../Types", "./Dictionaries/getIdentifier", "./HashSet", "../../extends"], function (require, exports) {
    "use strict";
    /*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
    var Types_1 = require("../Types");
    var getIdentifier_1 = require("./Dictionaries/getIdentifier");
    var HashSet_1 = require("./HashSet");
    var extends_1 = require("../../extends");
    // noinspection JSUnusedLocalSymbols
    var __extends = extends_1.default;
    function getId(obj) {
        return getIdentifier_1.getIdentifier(obj, typeof obj != Types_1.Type.BOOLEAN);
    }
    var Set = (function (_super) {
        __extends(Set, _super);
        function Set(source) {
            return _super.call(this, source, getId) || this;
        }
        return Set;
    }(HashSet_1.HashSet));
    exports.Set = Set;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Set;
});
//# sourceMappingURL=Set.js.map