/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Takes a target object and applies all source values to it.
     * @param target
     * @param source
     * @returns {any}
     */
    function apply(target, source) {
        var result = target || {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = source[key];
            }
        }
        return result;
    }
    exports_1("apply", apply);
    /**
     * Takes a target object and ensures values exist.
     * @param target
     * @param defaults
     * @returns {any}
     */
    function ensure(target, defaults) {
        var result = target || {};
        for (var key in defaults) {
            if (defaults.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                result[key] = defaults[key];
            }
        }
        return result;
    }
    exports_1("ensure", ensure);
    /**
     * Make a copy of the source object.
     * @param source
     * @returns {Object}
     */
    function copy(source) {
        return apply({}, source);
    }
    exports_1("copy", copy);
    /**
     * Takes two objects and creates another with the values of both.
     * B overwrites A.
     * @param a
     * @param b
     */
    function merge(a, b) {
        return apply(copy(a), b);
    }
    exports_1("merge", merge);
    return {
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
        }
    };
});
//# sourceMappingURL=MapUtility.js.map