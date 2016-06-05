/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from "../Compare";
import { remove, indexOf, contains, copyTo, removeIndex } from "./Array/Utility";
import { forEach } from "./Enumeration/Enumerator";
import { Type } from "../Types";
import { ArrayEnumerator } from "./Enumeration/ArrayEnumerator";
import { CollectionBase } from "./CollectionBase";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
export class List extends CollectionBase {
    constructor(source, equalityComparer = areEqual) {
        super(null, equalityComparer);
        var _ = this;
        if (Array.isArray(source)) {
            _._source = source.slice();
        }
        else {
            _._source = [];
            _._importEntries(source);
        }
    }
    getCount() {
        return this._source.length;
    }
    _addInternal(entry) {
        this._source.push(entry);
        return true;
    }
    _removeInternal(entry, max = Infinity) {
        return remove(this._source, entry, max, this._equalityComparer);
    }
    _clearInternal() {
        var len = this._source.length;
        this._source.length = 0;
        return len;
    }
    _importEntries(entries) {
        if (Type.isArrayLike(entries)) {
            var len = entries.length;
            if (!len)
                return 0;
            var s = this._source;
            var first = s.length;
            s.length += len;
            for (let i = 0; i < len; i++) {
                s[i + first] = entries[i];
            }
            return len;
        }
        else {
            return super._importEntries(entries);
        }
    }
    get(index) {
        return this._source[index];
    }
    set(index, value) {
        var s = this._source;
        if (index < s.length && areEqual(value, s[index]))
            return false;
        s[index] = value;
        this._onModified();
        return true;
    }
    indexOf(item) {
        return indexOf(this._source, item, this._equalityComparer);
    }
    insert(index, value) {
        var s = this._source;
        if (index < s.length) {
            this._source.splice(index, 0, value);
        }
        else {
            this._source[index] = value;
        }
        this._onModified();
    }
    removeAt(index) {
        if (removeIndex(this._source, index)) {
            this._onModified();
            return true;
        }
        return false;
    }
    contains(item) {
        return contains(this._source, item, this._equalityComparer);
    }
    copyTo(target, index) {
        return copyTo(this._source, target, 0, index);
    }
    getEnumerator() {
        return new ArrayEnumerator(this._source);
    }
    forEach(action, useCopy) {
        var s = this._source;
        return forEach(useCopy ? s.slice() : s, action);
    }
}
export default List;
//# sourceMappingURL=List.js.map