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
    /**
     * Returns true if the member matches the type.
     * @param instance
     * @param property
     * @param type
     * @returns {boolean}
     */
    function hasMemberOfType(instance, property, type) {
        return hasMember_1.default(instance, property) && typeof (instance[property]) === type;
    }
    exports.default = hasMemberOfType;
});
//# sourceMappingURL=hasMemberOfType.js.map