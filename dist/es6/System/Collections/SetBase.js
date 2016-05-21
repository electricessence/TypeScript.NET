/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { LinkedNodeList } from "./LinkedNodeList";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { forEach } from "./Enumeration/Enumerator";
import { EmptyEnumerator } from "./Enumeration/EmptyEnumerator";
import { using } from "../Disposable/dispose";
import { areEqual } from "../Compare";
import { CollectionBase } from "./CollectionBase";
const OTHER = 'other';
export class SetBase extends CollectionBase {
    constructor(source) {
        super(null, areEqual);
        this._importEntries(source);
    }
    _getSet() {
        var s = this._set;
        if (!s)
            this._set = s = new LinkedNodeList();
        return s;
    }
    getCount() {
        return this._set ? this._set.unsafeCount : 0;
    }
    exceptWith(other) {
        var _ = this;
        if (!other)
            throw new ArgumentNullException(OTHER);
        forEach(other, v => {
            if (_._removeInternal(v))
                _._incrementModified();
        });
        _._signalModification();
    }
    intersectWith(other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        var _ = this;
        if (other instanceof SetBase) {
            let s = _._set;
            if (s)
                s.forEach(n => {
                    if (!other.contains(n.value) && _._removeInternal(n.value))
                        _._incrementModified();
                });
            _._signalModification();
        }
        else {
            using(_.newUsing(other), o => _.intersectWith(o));
        }
    }
    isProperSubsetOf(other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        return other instanceof SetBase
            ? other.isProperSupersetOf(this)
            : using(this.newUsing(other), o => o.isProperSupersetOf(this));
    }
    isProperSupersetOf(other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        var result = true, count;
        if (other instanceof SetBase) {
            result = this.isSupersetOf(other);
            count = other.getCount();
        }
        else {
            count = using(this.newUsing(), o => {
                forEach(other, v => {
                    o.add(v);
                    return result = this.contains(v);
                });
                return o.getCount();
            });
        }
        return result && this.getCount() > count;
    }
    isSubsetOf(other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        return other instanceof SetBase
            ? other.isSupersetOf(this)
            : using(this.newUsing(other), o => o.isSupersetOf(this));
    }
    isSupersetOf(other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        var result = true;
        forEach(other, v => {
            return result = this.contains(v);
        });
        return result;
    }
    overlaps(other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        var result = false;
        forEach(other, v => !(result = this.contains(v)));
        return result;
    }
    setEquals(other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        return this.getCount() == (other instanceof SetBase
            ? other.getCount()
            : using(this.newUsing(other), o => o.getCount()))
            && this.isSubsetOf(other);
    }
    symmetricExceptWith(other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        var _ = this;
        if (other instanceof SetBase) {
            forEach(other, v => {
                if (_.contains(v)) {
                    if (_._removeInternal(v))
                        _._incrementModified();
                }
                else {
                    if (_._addInternal(v))
                        _._incrementModified();
                }
            });
            _._signalModification();
        }
        else {
            using(this.newUsing(other), o => _.symmetricExceptWith(o));
        }
    }
    unionWith(other) {
        this.importEntries(other);
    }
    _clearInternal() {
        var s = this._set;
        return s ? s.clear() : 0;
    }
    _onDispose() {
        super._onDispose();
        this._set = null;
    }
    contains(item) {
        return !(!this.getCount() || !this._getNode(item));
    }
    getEnumerator() {
        var s = this._set;
        return s && this.getCount()
            ? LinkedNodeList.valueEnumeratorFrom(s)
            : EmptyEnumerator;
    }
    forEach(action, useCopy = false) {
        return useCopy
            ? super.forEach(action, useCopy)
            : this._set.forEach((node, i) => action(node.value, i));
    }
    _removeNode(node) {
        if (!node)
            return false;
        return this.remove(node.value) != 0;
    }
    removeFirst() {
        var s = this._set;
        return this._removeNode(s && s.first);
    }
    removeLast() {
        var s = this._set;
        return this._removeNode(s && s.last);
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
export default SetBase;
//# sourceMappingURL=SetBase.js.map