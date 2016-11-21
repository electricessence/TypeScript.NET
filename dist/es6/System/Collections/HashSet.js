/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
import { SetBase } from "./SetBase";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
// noinspection JSUnusedLocalSymbols
const VOID0 = void 0;
export class HashSet extends SetBase {
    constructor(source, keyGenerator) {
        super();
        if (Type.isFunction(source)) {
            this._keyGenerator = source;
        }
        else {
            if (!keyGenerator)
                throw new ArgumentNullException("keyGenerator");
            this._keyGenerator = keyGenerator;
            this._importEntries(source);
        }
    }
    newUsing(source) {
        return new HashSet(source, this._keyGenerator);
    }
    _addInternal(item) {
        const _ = this;
        const type = typeof item;
        let r = _._registry, t = r && r[type];
        const key = _._keyGenerator(item);
        if (!t || t[key] === VOID0) {
            if (!r) {
                //noinspection JSUnusedAssignment
                _._registry = r = {};
            }
            if (!t) {
                //noinspection JSUnusedAssignment
                r[type] = t = {};
            }
            const node = { value: item };
            _._getSet().addNode(node);
            t[key] = node;
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
        this._keyGenerator = VOID0;
    }
    _getNode(item) {
        const r = this._registry, t = r && r[typeof item];
        return t && t[this._keyGenerator(item)];
    }
    _removeInternal(item, max = Infinity) {
        if (max === 0)
            return 0;
        const r = this._registry, t = r && r[typeof item], node = t && t[item];
        if (node) {
            delete t[item];
            const s = this._set;
            if (s && s.removeNode(node)) {
                return 1;
            }
        }
        return 0;
    }
}
function wipe(map, depth = 1) {
    if (map && depth) {
        for (let key of Object.keys(map)) {
            let v = map[key];
            delete map[key];
            wipe(v, depth - 1);
        }
    }
}
export default HashSet;
//# sourceMappingURL=HashSet.js.map