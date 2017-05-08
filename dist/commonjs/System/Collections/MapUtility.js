"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.apply = apply;
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
exports.ensure = ensure;
/**
 * Make a copy of the source object.
 * @param source
 * @returns {Object}
 */
function copy(source) {
    return apply({}, source);
}
exports.copy = copy;
/**
 * Takes two objects and creates another with the values of both.
 * B overwrites A.
 * @param a
 * @param b
 */
function merge(a, b) {
    return apply(copy(a), b);
}
exports.merge = merge;
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
exports.trim = trim;
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
exports.wipe = wipe;
//# sourceMappingURL=MapUtility.js.map