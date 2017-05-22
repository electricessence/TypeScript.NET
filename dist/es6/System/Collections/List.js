/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from "../Compare";
import { contains, copyTo, indexOf, remove, removeIndex } from "./Array/Utility";
import { forEach } from "./Enumeration/Enumerator";
import { Type } from "../Types";
import { CollectionBase } from "./CollectionBase";
import { EnumeratorBase } from "./Enumeration/EnumeratorBase";
// noinspection JSUnusedLocalSymbols
const VOID0 = void 0;
export class List extends CollectionBase {
    constructor(source, equalityComparer = areEqual) {
        super(VOID0, equalityComparer);
        if ((source) instanceof (Array)) {
            this._source = source.slice();
        }
        else {
            this._source = [];
            this._importEntries(source);
        }
    }
    _onDispose() {
        super._onDispose();
        this._source = null;
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
        const len = this._source.length;
        this._source.length = 0;
        return len;
    }
    _importEntries(entries) {
        if (Type.isArrayLike(entries)) {
            let len = entries.length;
            if (!len)
                return 0;
            const s = this._source;
            const first = s.length;
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
        const s = this._source;
        if (index < s.length && areEqual(value, s[index]))
            return false;
        s[index] = value;
        this._signalModification(true);
        return true;
    }
    indexOf(item) {
        return indexOf(this._source, item, this._equalityComparer);
    }
    insert(index, value) {
        const _ = this;
        const s = _._source;
        if (index < s.length) {
            _._source.splice(index, 0, value);
        }
        else {
            _._source[index] = value;
        }
        _._signalModification(true);
    }
    removeAt(index) {
        if (removeIndex(this._source, index)) {
            this._signalModification(true);
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
        const _ = this;
        _.throwIfDisposed();
        let source, index, version;
        return new EnumeratorBase(() => {
            source = _._source;
            version = _._version;
            index = 0;
        }, (yielder) => {
            if (index)
                _.throwIfDisposed();
            else if (_.wasDisposed) {
                // We never actually started? Then no biggie.
                return yielder.yieldBreak();
            }
            _.assertVersion(version);
            if (index >= source.length)
                return yielder.yieldBreak();
            return yielder.yieldReturn(source[index++]);
        });
    }
    /**
     * Sorts the underlying array.
     * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    sort(compareFn) {
        this._source.sort(compareFn);
        return this;
    }
    forEach(action, useCopy) {
        const s = this._source;
        return forEach(useCopy ? s.slice() : this, action);
    }
}
export default List;
//# sourceMappingURL=List.js.map