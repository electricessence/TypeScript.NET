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
     * Removes any keys that don't exist on the keyMap.
     * @param target
     * @param keyMap
     */
    function trimEntries(target, keyMap) {
        for (var key in target) {
            if (!keyMap.hasOwnProperty(key)) {
                delete target[key];
            }
        }
        //return <any>target;
    }
    exports.trimEntries = trimEntries;
});
//# sourceMappingURL=trimEntries.js.map