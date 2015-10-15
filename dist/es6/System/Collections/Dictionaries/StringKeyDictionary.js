///<reference path="IDictionary.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from '../../Compare';
import DictionaryAbstractBase from './DictionaryAbstractBase';
export default class StringKeyDictionary extends DictionaryAbstractBase {
    constructor(...args) {
        super(...args);
        this._count = 0;
        this._map = {};
    }
    containsKey(key) {
        return key in this._map;
    }
    containsValue(value) {
        var map = this._map, equal = areEqual;
        for (let key in map) {
            if (map.hasOwnProperty(key) && equal(map[key], value))
                return true;
        }
        return false;
    }
    getValue(key) {
        return this._map[key];
    }
    setValue(key, value) {
        var _ = this, map = _._map, old = map[key];
        if (old !== value) {
            if (value === undefined) {
                if (key in map) {
                    delete map[key];
                    --_._count;
                }
            }
            else {
                if (!(key in map))
                    ++_._count;
                map[key] = value;
            }
            _._onValueUpdate(key, value, old);
            return true;
        }
        return false;
    }
    importMap(values) {
        var _ = this;
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
        var _ = this, result = {};
        for (let key in _._map) {
            if (_._map.hasOwnProperty(key)) {
                var value = _._map[key];
                if (selector)
                    value = selector(key, value);
                if (value !== undefined)
                    result[key] = value;
            }
        }
        return result;
    }
    get keys() {
        var _ = this, result = [];
        for (let key in _._map) {
            if (_._map.hasOwnProperty(key))
                result.push(key);
        }
        return result;
    }
    get values() {
        var _ = this, result = [];
        for (let key in _._map) {
            if (_._map.hasOwnProperty(key))
                result.push(_._map[key]);
        }
        return result;
    }
    get count() {
        return this._count;
    }
}
//# sourceMappingURL=StringKeyDictionary.js.map