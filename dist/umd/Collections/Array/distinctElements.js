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
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function distinctElements(source) {
        if (!source)
            return []; // Allowing for null facilitates regex filtering.
        var seen = {};
        return source.filter(function (e) { return !(e in seen) && (seen[e] = true); });
    }
    exports.default = distinctElements;
});
//# sourceMappingURL=distinctElements.js.map