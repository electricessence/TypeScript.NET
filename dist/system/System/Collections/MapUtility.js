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
    exports_1("trim", trim);
    function wipe(map, depth) {
        if (depth === void 0) { depth = 1; }
        if (map && depth) {
            for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
                var key = _a[_i];
                var v = map[key];
                delete map[key];
                wipe(v, depth - 1);
            }
        }
    }
    exports_1("wipe", wipe);
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