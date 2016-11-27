(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    function apply(target, source) {
        var result = target || {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = source[key];
            }
        }
        return result;
    }
    exports.apply = apply;
    function ensure(target, defaults) {
        var result = target || {};
        for (var key in defaults) {
            if (defaults.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                result[key] = defaults[key];
            }
        }
        return result;
    }
    exports.ensure = ensure;
    function copy(source) {
        return apply({}, source);
    }
    exports.copy = copy;
    function merge(a, b) {
        return apply(copy(a), b);
    }
    exports.merge = merge;
    function trim(target, keyMap) {
        for (var key in target) {
            if (!keyMap.hasOwnProperty(key)) {
                delete target[key];
            }
        }
    }
    exports.trim = trim;
});
//# sourceMappingURL=MapUtility.js.map