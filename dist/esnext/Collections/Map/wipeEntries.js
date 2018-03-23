/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
export function wipeEntries(map, depth) {
    if (depth === void 0) { depth = 1; }
    if (map && depth) {
        for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
            var key = _a[_i];
            var v = map[key];
            delete map[key];
            wipeEntries(v, depth - 1);
        }
    }
}
//# sourceMappingURL=wipeEntries.js.map