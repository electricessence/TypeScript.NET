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
     * This takes a string and replaces '{string}' with the respected parameter.
     * Also allows for passing an array in order to use '{n}' notation.
     * Not limited to an array's indexes.  For example, {length} is allowed.
     * Based upon Crockford's supplant function.
     * @param source
     * @param params
     * @returns {string}
     */
    function supplant(source, params) {
        return source.replace(/{([^{}]*)}/g, function (a, b) {
            if (b in params)
                return params[b] + '';
            throw "Param {" + b + "} value not provided.";
        });
    }
    exports.supplant = supplant;
    /**
     * Takes any set of arguments and replaces based on index.
     * @param source
     * @param args
     * @returns {string}
     */
    function format(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return supplant(source, args);
    }
    exports.format = format;
});
//# sourceMappingURL=supplant.js.map