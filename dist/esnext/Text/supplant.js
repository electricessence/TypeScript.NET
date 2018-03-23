/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * This takes a string and replaces '{string}' with the respected parameter.
 * Also allows for passing an array in order to use '{n}' notation.
 * Not limited to an array's indexes.  For example, {length} is allowed.
 * Based upon Crockford's supplant function.
 * @param source
 * @param params
 * @returns {string}
 */
export function supplant(source, params) {
    return source.replace(/{([^{}]*)}/g, function (a, b) {
        if (b in params)
            return params[b];
        throw "Param {" + b + "} value not provided.";
    });
}
/**
 * Takes any set of arguments and replaces based on index.
 * @param source
 * @param args
 * @returns {string}
 */
export function format(source) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return supplant(source, args);
}
//# sourceMappingURL=supplant.js.map