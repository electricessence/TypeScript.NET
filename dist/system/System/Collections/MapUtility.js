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
    /**
     * Make a copy of the source object.
     * @param source
     * @returns {Object}
     */
    function copy(source) {
        return apply({}, source);
    }
    /**
     * Takes two objects and creates another with the values of both.
     * B overwrites A.
     * @param a
     * @param b
     */
    function merge(a, b) {
        return apply(copy(a), b);
    }
    /**
     * Removes any keys that don't exist on the keyMap.
     * @param target
     * @param keyMap
     */
    function trim(target, keyMap) {
        for (var key in target) {
            if (!keyMap.hasOwnProperty(key)) {
                delete target[key];
            }
        }
        //return <any>target;
    }
    exports_1("apply", apply);
    exports_1("ensure", ensure);
    exports_1("copy", copy);
    exports_1("merge", merge);
    exports_1("trim", trim);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=MapUtility.js.map