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
        define(["require", "exports", "./EmptyEnumerator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmptyEnumerator_1 = require("./EmptyEnumerator");
    var EmptyEnumerable = /** @class */ (function () {
        function EmptyEnumerable() {
            this.isEndless = false;
        }
        // noinspection JSMethodCanBeStatic
        EmptyEnumerable.prototype.getEnumerator = function () {
            return EmptyEnumerator_1.default;
        };
        return EmptyEnumerable;
    }());
    exports.default = EmptyEnumerable;
});
//# sourceMappingURL=EmptyEnumerable.js.map