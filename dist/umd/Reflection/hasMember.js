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
        define(["require", "exports", "./isPrimitive"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isPrimitive_1 = require("./isPrimitive");
    /**
     * Will detect if a member exists (using 'in').
     * Returns true if a property or method exists on the object or its prototype.
     * @param instance
     * @param property Name of the member.
     * @param ignoreUndefined When ignoreUndefined is true, if the member exists but is undefined, it will return false.
     * @returns {boolean}
     */
    function hasMember(instance, property, ignoreUndefined) {
        if (ignoreUndefined === void 0) { ignoreUndefined = true; }
        return instance && !isPrimitive_1.default(instance) && (property) in (instance) && (ignoreUndefined || instance[property] !== undefined);
    }
    exports.default = hasMember;
});
//# sourceMappingURL=hasMember.js.map