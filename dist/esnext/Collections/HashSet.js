/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import SetBase from "./SetBase";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
var VOID0 = void 0;
var HashSet = /** @class */ (function (_super) {
    tslib_1.__extends(HashSet, _super);
    function HashSet(source, keyGenerator) {
        var _this = _super.call(this) || this;
        if (typeof source === "function") {
            _this._keyGenerator = source;
        }
        else {
            if (!keyGenerator)
                throw new ArgumentNullException("keyGenerator");
            _this._keyGenerator = keyGenerator;
            _this._importEntries(source);
        }
        return _this;
    }
    HashSet.prototype.newUsing = function (source) {
        return new HashSet(source, this._keyGenerator);
    };
    HashSet.prototype._addInternal = function (item) {
        var _ = this;
        var type = typeof item;
        var r = _._registry, t = r && r[type];
        var key = _._keyGenerator(item);
        if (!t || t[key] === VOID0) {
            if (!r) {
                //noinspection JSUnusedAssignment
                _._registry = r = {};
            }
            if (!t) {
                //noinspection JSUnusedAssignment
                r[type] = t = {};
            }
            var node = { value: item };
            _._getSet().addNode(node);
            t[key] = node;
            return true;
        }
        return false;
    };
    HashSet.prototype._clearInternal = function () {
        wipe(this._registry, 2);
        return _super.prototype._clearInternal.call(this);
    };
    HashSet.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this._registry = null;
        this._keyGenerator = VOID0;
    };
    HashSet.prototype._getNode = function (item) {
        var r = this._registry, t = r && r[typeof item];
        return t && t[this._keyGenerator(item)];
    };
    HashSet.prototype._removeInternal = function (item, max) {
        if (max === void 0) { max = Infinity; }
        if (max === 0)
            return 0;
        var r = this._registry, t = r && r[typeof item], node = t && t[item];
        if (node) {
            delete t[item];
            var s = this._set;
            if (s && s.removeNode(node)) {
                return 1;
            }
        }
        return 0;
    };
    return HashSet;
}(SetBase));
export { HashSet };
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
export default HashSet;
//# sourceMappingURL=HashSet.js.map