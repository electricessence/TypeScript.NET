/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import { areEqual } from '../../Compare';
import Type from '../../Types';
import Functions from '../../Functions';
import DictionaryBase from './DictionaryBase';
import EnumeratorBase from '../Enumeration/EnumeratorBase';
const VOID0 = void 0;
class HashEntry {
    constructor(key, value, previous, next) {
        this.key = key;
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
}
class EntryList {
    constructor(first, last) {
        this.first = first;
        this.last = last;
    }
    addLast(entry) {
        var _ = this;
        if (_.last != null) {
            _.last.next = entry;
            entry.previous = _.last;
            _.last = entry;
        }
        else
            _.first = _.last = entry;
    }
    replace(entry, newEntry) {
        var _ = this;
        if (entry.previous != null) {
            entry.previous.next = newEntry;
            newEntry.previous = entry.previous;
        }
        else
            _.first = newEntry;
        if (entry.next != null) {
            entry.next.previous = newEntry;
            newEntry.next = entry.next;
        }
        else
            _.last = newEntry;
    }
    remove(entry) {
        var _ = this;
        if (entry.previous != null)
            entry.previous.next = entry.next;
        else
            _.first = entry.next;
        if (entry.next != null)
            entry.next.previous = entry.previous;
        else
            _.last = entry.previous;
    }
    clear() {
        var _ = this;
        while (_.last) {
            _.remove(_.last);
        }
    }
    forEach(closure) {
        var _ = this, currentEntry = _.first;
        while (currentEntry) {
            closure(currentEntry);
            currentEntry = currentEntry.next;
        }
    }
}
function callHasOwnProperty(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
}
function computeHashCode(obj) {
    if (obj === null)
        return "null";
    if (obj === VOID0)
        return "undefined";
    return (typeof obj.toString === Type.FUNCTION)
        ? obj.toString()
        : Object.prototype.toString.call(obj);
}
export default class Dictionary extends DictionaryBase {
    constructor(_compareSelector = Functions.Identity) {
        super();
        this._compareSelector = _compareSelector;
        this._count = 0;
        this._entries = new EntryList();
        this._buckets = {};
    }
    setKV(key, value, allowOverwrite) {
        var _ = this, buckets = _._buckets, entries = _._entries, comparer = _._compareSelector, compareKey = comparer(key), hash = computeHashCode(compareKey), entry;
        if (callHasOwnProperty(buckets, hash)) {
            var equal = areEqual;
            var array = buckets[hash];
            for (let i = 0; i < array.length; i++) {
                var old = array[i];
                if (comparer(old.key) === compareKey) {
                    if (!allowOverwrite)
                        throw new Error("Key already exists.");
                    var changed = !equal(old.value, value);
                    if (changed) {
                        if (value === VOID0) {
                            entries.remove(old);
                            array.splice(i, 1);
                            if (!array.length)
                                delete buckets[hash];
                            --_._count;
                        }
                        else {
                            entry = new HashEntry(key, value);
                            entries.replace(old, entry);
                            array[i] = entry;
                        }
                        _._onValueUpdate(key, value, old.value);
                    }
                    return changed;
                }
            }
            array.push(entry = entry || new HashEntry(key, value));
        }
        else {
            if (value === VOID0) {
                if (allowOverwrite)
                    return false;
                else
                    throw new Error("Cannot add 'undefined' value.");
            }
            buckets[hash] = [entry = new HashEntry(key, value)];
        }
        ++_._count;
        entries.addLast(entry);
        _._onValueUpdate(key, value, undefined);
        return true;
    }
    addByKeyValue(key, value) {
        this.setKV(key, value, false);
    }
    getValue(key) {
        var buckets = this._buckets, comparer = this._compareSelector;
        var compareKey = comparer(key);
        var hash = computeHashCode(compareKey);
        if (!callHasOwnProperty(buckets, hash))
            return undefined;
        var array = buckets[hash];
        for (let entry of array) {
            if (comparer(entry.key) === compareKey)
                return entry.value;
        }
        return undefined;
    }
    setValue(key, value) {
        return this.setKV(key, value, true);
    }
    containsKey(key) {
        var _ = this, buckets = _._buckets, comparer = _._compareSelector;
        var compareKey = comparer(key);
        var hash = computeHashCode(compareKey);
        if (!callHasOwnProperty(buckets, hash))
            return false;
        var array = buckets[hash];
        for (let i = 0, len = array.length; i < len; i++) {
            if (comparer(array[i].key) === compareKey)
                return true;
        }
        return false;
    }
    clear() {
        var _ = this, buckets = _._buckets, count = super.clear();
        _._count = 0;
        for (let key in buckets) {
            if (buckets.hasOwnProperty(key))
                delete buckets[key];
        }
        _._entries.clear();
        return count;
    }
    getCount() {
        return this._count;
    }
    getEnumerator() {
        var _ = this, currentEntry;
        return new EnumeratorBase(() => { currentEntry = _._entries.first; }, (yielder) => {
            if (currentEntry != null) {
                var result = { key: currentEntry.key, value: currentEntry.value };
                currentEntry = currentEntry.next;
                return yielder.yieldReturn(result);
            }
            return yielder.yieldBreak();
        });
    }
    getKeys() {
        var _ = this, result = [];
        _._entries.forEach(entry => result.push(entry.key));
        return result;
    }
    getValues() {
        var _ = this, result = [];
        _._entries.forEach(entry => result.push(entry.value));
        return result;
    }
}
//# sourceMappingURL=Dictionary.js.map