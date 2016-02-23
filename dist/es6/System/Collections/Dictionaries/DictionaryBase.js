/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import { areEqual } from '../../Compare';
import EnumeratorBase from '../Enumeration/EnumeratorBase';
import ArgumentNullException from '../../Exceptions/ArgumentNullException';
import InvalidOperationException from '../../Exceptions/InvalidOperationException';
import extractKeyValue from '../../KeyValueExtract';
import { forEach } from '../Enumeration/Enumerator';
const VOID0 = void (0);
class DictionaryBase {
    constructor() {
        this._updateRecursion = 0;
    }
    get isUpdating() { return this._updateRecursion != 0; }
    _onValueUpdate(key, value, old) {
        if (!areEqual(value, old, true)) {
            var _ = this;
            if (_.onValueChanged)
                _.onValueChanged(key, value, old);
            if (_._updateRecursion == 0)
                _._onUpdated();
        }
    }
    _onUpdated() {
        var _ = this;
        if (_.onUpdated)
            _.onUpdated();
    }
    handleUpdate(closure) {
        var _ = this, result;
        if (closure) {
            _._updateRecursion++;
            try {
                result = closure();
            }
            finally {
                _._updateRecursion--;
            }
        }
        else
            result = _._updateRecursion == 0;
        if (result && _._updateRecursion == 0)
            _._onUpdated();
        return result;
    }
    get isReadOnly() { return false; }
    get count() { return this.getCount(); }
    add(item) {
        if (!item)
            throw new ArgumentNullException('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
        extractKeyValue(item, (key, value) => this.addByKeyValue(key, value));
    }
    clear() {
        var _ = this, keys = _.keys, count = keys.length;
        if (count)
            _.handleUpdate(() => {
                keys.forEach(key => { _.removeByKey(key); });
                return true;
            });
        if (_.count != 0)
            console.warn("Dictionary clear() results in mismatched count.");
        return count;
    }
    contains(item) {
        if (!item)
            return false;
        return extractKeyValue(item, (key, value) => {
            let v = this.getValue(key);
            return areEqual(value, v);
        });
    }
    copyTo(array, index = 0) {
        if (!array)
            throw new ArgumentNullException('array');
        var e = this.getEnumerator();
        while (e.moveNext()) {
            array[index++] = e.current;
        }
        return array;
    }
    toArray() {
        return this.copyTo([], 0);
    }
    remove(item) {
        if (!item)
            return 0;
        return extractKeyValue(item, (key, value) => {
            let v = this.getValue(key);
            return (areEqual(value, v) && this.removeByKey(key))
                ? 1 : 0;
        });
    }
    get keys() { return this.getKeys(); }
    get values() { return this.getValues(); }
    addByKeyValue(key, value) {
        var _ = this;
        if (_.containsKey(key)) {
            var ex = new InvalidOperationException("Adding a key/value when the key already exists.");
            ex.data['key'] = key;
            ex.data['value'] = value;
            throw ex;
        }
        _.setValue(key, value);
    }
    containsKey(key) {
        var value = this.getValue(key);
        return value !== VOID0;
    }
    containsValue(value) {
        var e = this.getEnumerator(), equal = areEqual;
        while (e.moveNext()) {
            if (equal(e.current, value, true)) {
                e.dispose();
                return true;
            }
        }
        return false;
    }
    removeByKey(key) {
        return this.setValue(key, undefined);
    }
    removeByValue(value) {
        var _ = this, count = 0, equal = areEqual;
        _.keys.forEach(key => {
            if (equal(_.getValue(key), value, true)) {
                _.removeByKey(key);
                ++count;
            }
        });
        return count;
    }
    importPairs(pairs) {
        var _ = this;
        if (!pairs)
            return false;
        return _.handleUpdate(() => {
            let changed = false;
            forEach(pairs, pair => extractKeyValue(pair, (key, value) => {
                _.setValue(key, value);
                changed = true;
            }));
            return changed;
        });
    }
    getEnumerator() {
        var _ = this;
        var keys, len, i = 0;
        return new EnumeratorBase(() => {
            keys = _.keys;
            len = keys.length;
        }, (yielder) => {
            while (i < len) {
                var key = keys[i++], value = _.getValue(key);
                if (value !== VOID0)
                    return yielder.yieldReturn({ key: key, value: value });
            }
            return yielder.yieldBreak();
        });
    }
}
export default DictionaryBase;
//# sourceMappingURL=DictionaryBase.js.map