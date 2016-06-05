/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from "../../Compare";
import { forEach } from "../Enumeration/Enumerator";
import { CollectionBase } from "../CollectionBase";
import { EnumeratorBase } from "../Enumeration/EnumeratorBase";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { InvalidOperationException } from "../../Exceptions/InvalidOperationException";
import { extractKeyValue } from "../../KeyValueExtract";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
const VOID0 = void (0);
export class DictionaryBase extends CollectionBase {
    constructor(source) {
        super(source);
    }
    _onValueModified(key, value, old) {
    }
    _addInternal(item) {
        if (!item)
            throw new ArgumentNullException('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
        return extractKeyValue(item, (key, value) => this.addByKeyValue(key, value));
    }
    _clearInternal() {
        var _ = this, count = 0;
        for (let key of _.keys) {
            if (_.removeByKey(key))
                count++;
        }
        return count;
    }
    contains(item) {
        if (!item || !this.getCount())
            return false;
        return extractKeyValue(item, (key, value) => {
            let v = this.getValue(key);
            return areEqual(value, v);
        });
    }
    _removeInternal(item) {
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
        if (value === VOID0)
            throw new InvalidOperationException("Cannot add 'undefined' as a value.");
        var _ = this;
        if (_.containsKey(key)) {
            var ex = new InvalidOperationException("Adding a key/value when the key already exists.");
            ex.data['key'] = key;
            ex.data['value'] = value;
            throw ex;
        }
        return _.setValue(key, value);
    }
    setValue(key, value) {
        var _ = this;
        _.assertModifiable();
        var changed = false, old = _.getValue(key);
        if (!areEqual(value, old) && _._setValueInternal(key, value)) {
            changed = true;
            _._onValueModified(key, value, old);
        }
        _._signalModification(changed);
        return changed;
    }
    containsKey(key) {
        return !!this._getEntry(key);
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
        return this.setValue(key, VOID0);
    }
    removeByValue(value) {
        var _ = this, count = 0, equal = areEqual;
        for (let key of _.getKeys()) {
            if (equal(_.getValue(key), value, true)) {
                _.removeByKey(key);
                count++;
            }
        }
        return count;
    }
    importEntries(pairs) {
        return super.importEntries(pairs);
    }
    _importEntries(pairs) {
        var _ = this;
        if (!pairs)
            return 0;
        let changed = 0;
        forEach(pairs, pair => extractKeyValue(pair, (key, value) => {
            if (_._setValueInternal(key, value))
                changed++;
        }));
        return changed;
    }
    getEnumerator() {
        var _ = this;
        var ver, keys, len, i = 0;
        return new EnumeratorBase(() => {
            ver = _._version;
            keys = _.getKeys();
            len = keys.length;
        }, (yielder) => {
            _.assertVersion(ver);
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