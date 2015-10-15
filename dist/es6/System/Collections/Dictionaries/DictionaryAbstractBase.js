/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from '../../Compare';
import EnumeratorBase from '../Enumeration/EnumeratorBase';
import NotImplementedException from '../../Exceptions/NotImplementedException';
import ArgumentException from '../../Exceptions/ArgumentException';
import ArgumentNullException from '../../Exceptions/ArgumentNullException';
import InvalidOperationException from '../../Exceptions/InvalidOperationException';
export default class DictionaryAbstractBase {
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
    get count() {
        throw notImplemented("count");
    }
    add(item) {
        if (!item)
            throw new ArgumentException('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
        this.addByKeyValue(item.key, item.value);
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
        var value = this.getValue(item.key);
        return areEqual(value, item.value);
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
        var key = item.key, value = this.getValue(key);
        return (areEqual(value, item.value) && this.removeByKey(key))
            ? 1 : 0;
    }
    get keys() { throw notImplemented("keys"); }
    get values() { throw notImplemented("values"); }
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
    getValue(key) {
        throw notImplemented("getValue(key: TKey): TValue", "When calling for key: " + key);
    }
    setValue(key, value) {
        throw notImplemented("setValue(key: TKey, value: TValue): boolean", "When setting " + key + ":" + value + ".");
    }
    containsKey(key) {
        var value = this.getValue(key);
        return value !== undefined;
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
        return _.handleUpdate(() => {
            var changed = false;
            pairs.forEach(pair => {
                _.setValue(pair.key, pair.value);
                changed = true;
            });
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
                if (value !== undefined)
                    return yielder.yieldReturn({ key: key, value: value });
            }
            return yielder.yieldBreak();
        });
    }
}
function notImplemented(name, log = "") {
    console.log("DictionaryAbstractBase sub-class has not overridden " + name + ". " + log);
    return new NotImplementedException("DictionaryAbstractBase." + name + ": Not implemented.");
}
//# sourceMappingURL=DictionaryAbstractBase.js.map