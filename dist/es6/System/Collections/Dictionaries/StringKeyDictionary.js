/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from "../../Compare";
import { DictionaryBase } from "./DictionaryBase";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
const VOID0 = void 0;
export class StringKeyDictionary extends DictionaryBase {
    constructor() {
        super(...arguments);
        this._count = 0;
        this._map = {};
    }
    _onDispose() {
        super._onDispose();
        this._map = null;
    }
    _getEntry(key) {
        return !this.containsKey(key)
            ? null : {
            key: key,
            value: this.getAssuredValue(key)
        };
    }
    containsKey(key) {
        return key !== null
            && key !== VOID0
            && this._count != 0
            && this._map[key] !== VOID0;
    }
    containsValue(value) {
        if (!this._count)
            return false;
        var map = this._map;
        for (let key in map) {
            if (map.hasOwnProperty(key) && areEqual(map[key], value))
                return true;
        }
        return false;
    }
    getValue(key) {
        return key === null || key === VOID0 || !this._count
            ? VOID0
            : this._map[key];
    }
    _setValueInternal(key, value) {
        const _ = this;
        var map = _._map, old = map[key];
        if (old !== value) {
            if (value === VOID0) {
                if ((key) in (map)) {
                    delete map[key];
                    _._count--;
                }
            }
            else {
                if (!map.hasOwnProperty(key))
                    _._count++;
                map[key] = value;
            }
            return true;
        }
        return false;
    }
    importMap(values) {
        const _ = this;
        return _.handleUpdate(() => {
            var changed = false;
            for (let key in values) {
                if (values.hasOwnProperty(key) && _.setValue(key, values[key]))
                    changed = true;
            }
            return changed;
        });
    }
    toMap(selector) {
        const _ = this;
        var result = {};
        if (_._count)
            for (let key in _._map) {
                if (_._map.hasOwnProperty(key)) {
                    var value = _._map[key];
                    if (selector)
                        value = selector(key, value);
                    if (value !== VOID0)
                        result[key] = value;
                }
            }
        return result;
    }
    getKeys() {
        return Object.keys(this._map);
    }
    getValues() {
        if (!this._count)
            return [];
        var result = Object.keys(this._map);
        for (let i = 0, len = result.length; i < len; i++) {
            result[i] = this._map[result[i]];
        }
        return result;
    }
    getCount() {
        return this._count;
    }
}
export default StringKeyDictionary;
//# sourceMappingURL=StringKeyDictionary.js.map