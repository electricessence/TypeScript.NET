/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { forEach } from "./Enumeration/Enumerator";
import { areEqual } from "../Compare";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { DisposableBase } from "../Disposable/DisposableBase";
import { Type } from "../Types";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const NAME = "CollectionBase", CMDC = "Cannot modify a disposed collection.", CMRO = "Cannot modify a read-only collection.", RESOLVE = "resolve", LINQ_PATH = "../../System.Linq/Linq";
export class CollectionBase extends DisposableBase {
    constructor(source, _equalityComparer = areEqual) {
        super();
        this._equalityComparer = _equalityComparer;
        var _ = this;
        _._disposableObjectName = NAME;
        _._importEntries(source);
        _._updateRecursion = 0;
        _._modifiedCount = 0;
        _._version = 0;
    }
    get count() {
        return this.getCount();
    }
    getIsReadOnly() {
        return false;
    }
    get isReadOnly() {
        return this.getIsReadOnly();
    }
    assertModifiable() {
        this.throwIfDisposed(CMDC);
        if (this.getIsReadOnly())
            throw new InvalidOperationException(CMRO);
    }
    assertVersion(version) {
        if (version != this._version)
            throw new InvalidOperationException("Collection was modified.");
    }
    _onModified() { }
    _signalModification(increment) {
        var _ = this;
        if (increment)
            _._modifiedCount++;
        if (_._modifiedCount && !this._updateRecursion) {
            _._modifiedCount = 0;
            _._version++;
            try {
                _._onModified();
            }
            catch (ex) {
                console.error(ex);
            }
            return true;
        }
        return false;
    }
    _incrementModified() { this._modifiedCount++; }
    get isUpdating() { return this._updateRecursion != 0; }
    handleUpdate(closure) {
        if (!closure)
            return false;
        var _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        var updated = false;
        try {
            if (updated = closure())
                _._modifiedCount++;
        }
        finally {
            _._updateRecursion--;
        }
        _._signalModification();
        return updated;
    }
    add(entry) {
        var _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        try {
            if (_._addInternal(entry))
                _._modifiedCount++;
        }
        finally {
            _._updateRecursion--;
        }
        _._signalModification();
    }
    remove(entry, max = Infinity) {
        var _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        var n;
        try {
            if (n = _._removeInternal(entry, max))
                _._modifiedCount++;
        }
        finally {
            _._updateRecursion--;
        }
        _._signalModification();
        return n;
    }
    clear() {
        var _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        var n;
        try {
            if (n = _._clearInternal())
                _._modifiedCount++;
        }
        finally {
            _._updateRecursion--;
        }
        _._signalModification();
        return n;
    }
    _onDispose() {
        super._onDispose();
        this._clearInternal();
        this._version = 0;
        this._updateRecursion = 0;
        this._modifiedCount = 0;
        var l = this._linq;
        this._linq = null;
        if (l)
            l.dispose();
    }
    _importEntries(entries) {
        var added = 0;
        if (entries) {
            if (Array.isArray(entries)) {
                for (let e of entries) {
                    if (this._addInternal(e))
                        added++;
                }
            }
            else {
                forEach(entries, e => {
                    if (this._addInternal(e))
                        added++;
                });
            }
        }
        return added;
    }
    importEntries(entries) {
        var _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        var n;
        try {
            if (n = _._importEntries(entries))
                _._modifiedCount++;
        }
        finally {
            _._updateRecursion--;
        }
        _._signalModification();
        return n;
    }
    contains(entry) {
        if (!this.getCount())
            return false;
        var found = false, equals = this._equalityComparer;
        this.forEach(e => !(found = equals(entry, e)));
        return found;
    }
    forEach(action, useCopy) {
        if (useCopy) {
            var a = this.toArray();
            try {
                return forEach(a, action);
            }
            finally {
                a.length = 0;
            }
        }
        else {
            return forEach(this.getEnumerator(), action);
        }
    }
    copyTo(target, index = 0) {
        if (!target)
            throw new ArgumentNullException('target');
        var count = this.getCount(), newLength = count + index;
        if (target.length < newLength)
            target.length = newLength;
        var e = this.getEnumerator();
        while (e.moveNext()) {
            target[index++] = e.current;
        }
        return target;
    }
    toArray() {
        var count = this.getCount();
        return this.copyTo(count > 65536 ? new Array(count) : []);
    }
    get linq() {
        if (Type.hasMember(require, RESOLVE) && require.length == 1) {
            var e = this._linq;
            if (!e)
                this._linq = e = require(LINQ_PATH).default.from(this);
            return e;
        }
        else {
            throw ".linq currently only supported within CommonJS.\nImport System.Linq/Linq and use Enumerable.from(e) instead.";
        }
    }
}
//# sourceMappingURL=CollectionBase.js.map