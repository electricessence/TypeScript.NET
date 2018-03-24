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
        define(["require", "exports", "./hasMemberOfType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasMemberOfType_1 = require("./hasMemberOfType");
    function hasMethod(instance, property) {
        return hasMemberOfType_1.default(instance, property, "function" /* Function */);
    }
    exports.default = hasMethod;
});
//# sourceMappingURL=hasMethod.js.map