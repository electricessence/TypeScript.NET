/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { SetBase } from "./SetBase";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const OTHER = 'other';
export class Set extends SetBase {
    newUsing(source) {
        return new Set(source);
    }
    _addInternal(item) {
        var _ = this;
        if (!_.contains(item)) {
            var type = typeof item;
            if (!Type.isPrimitive(type))
                throw new ArgumentException("item", "A Set can only index primitives.  Complex objects require a HashSet.");
            var r = _._registry;
            var t = r && r[type];
            if (!r)
                _._registry = r = {};
            if (!t)
                r[type] = t = {};
            var node = { value: item };
            _._getSet().addNode(node);
            t[item] = node;
            return true;
        }
        return false;
    }
    _clearInternal() {
        wipe(this._registry, 2);
        return super._clearInternal();
    }
    _onDispose() {
        super._onDispose();
        this._registry = null;
    }
    _getNode(item) {
        var r = this._registry, t = r && r[typeof item];
        return t && t[item];
    }
    _removeInternal(item, max = Infinity) {
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
    }
}
function wipe(map, depth = 1) {
    if (map && depth) {
        for (var key of Object.keys(map)) {
            var v = map[key];
            delete map[key];
            wipe(v, depth - 1);
        }
    }
}
export default Set;
//# sourceMappingURL=Set.js.map