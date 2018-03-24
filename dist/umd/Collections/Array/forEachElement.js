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
    /**
     * Allows for using "false" to cause forEach to break.
     * Can also be applied to a structure that indexes like an array, but may not be.
     * @param source
     * @param action
     */
    function forEachElement(source, action) {
        if (source && action) {
            // Don't cache the length since it is possible that the underlying array changed.
            for (var i = 0; i < source.length; i++) {
                if (action(source[i], i) === false)
                    break;
            }
        }
    }
    exports.default = forEachElement;
});
//# sourceMappingURL=forEachElement.js.map