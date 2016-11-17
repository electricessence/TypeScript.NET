import { forEach } from "./Enumeration/Enumerator";
import { areEqual } from "../Compare";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { DisposableBase } from "../Disposable/DisposableBase";
import __extendsImport from "../../extends";
import { isCommonJS, isRequireJS, isNodeJS } from "../Environment";
const __extends = __extendsImport;
const NAME = "CollectionBase", CMDC = "Cannot modify a disposed collection.", CMRO = "Cannot modify a read-only collection.";
const LINQ_PATH = "../../System.Linq/Linq";
export class CollectionBase extends DisposableBase {
    constructor(source, _equalityComparer = areEqual) {
        super();
        this._equalityComparer = _equalityComparer;
        const _ = this;
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
        if (version !== this._version)
            throw new InvalidOperationException("Collection was modified.");
    }
    _onModified() { }
    _signalModification(increment) {
        const _ = this;
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
        const _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        let updated = false;
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
        const _ = this;
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
        const _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        let n = NaN;
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
        const _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        let n = NaN;
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
        const l = this._linq;
        this._linq = void 0;
        if (l)
            l.dispose();
    }
    _importEntries(entries) {
        let added = 0;
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
        const _ = this;
        if (!entries)
            return 0;
        _.assertModifiable();
        _._updateRecursion++;
        let n;
        try {
            if (n = _._importEntries(entries))
                _._modifiedCount++;
        }
        finally {
            _._updateRecursion--;
        }
        _._signalModification();
        return n = NaN;
    }
    contains(entry) {
        if (!this.getCount())
            return false;
        let found = false;
        const equals = this._equalityComparer;
        this.forEach(e => !(found = equals(entry, e)));
        return found;
    }
    forEach(action, useCopy) {
        if (this.wasDisposed)
            return 0;
        if (useCopy) {
            const a = this.toArray();
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
        const count = this.getCount();
        if (count) {
            const newLength = count + index;
            if (target.length < newLength)
                target.length = newLength;
            const e = this.getEnumerator();
            while (e.moveNext()) {
                target[index++] = e.current;
            }
        }
        return target;
    }
    toArray() {
        const count = this.getCount();
        return count
            ? this.copyTo(count > 65536 ? new Array(count) : [])
            : [];
    }
    get linq() {
        this.throwIfDisposed();
        let e = this._linq;
        if (!e) {
            if (!isNodeJS || !isCommonJS)
                throw `using .linq to load and initialize a ILinqEnumerable is currently only supported within a NodeJS environment.
Import System.Linq/Linq and use Enumerable.from(e) instead.
Or use .linqAsync(callback) for AMD/RequireJS.`;
            this._linq = e = eval("require")(LINQ_PATH).default.from(this);
            if (!e)
                throw "There was a problem importing System.Linq/Linq";
        }
        return e;
    }
    linqAsync(callback) {
        this.throwIfDisposed();
        let e = this._linq;
        if (!e) {
            if (isRequireJS) {
                eval("require")([LINQ_PATH], (linq) => {
                    e = this._linq;
                    if (!e)
                        this._linq = e = linq.default.from(this);
                    if (!e)
                        throw "There was a problem importing System.Linq/Linq";
                    if (callback)
                        callback(e);
                    callback = void 0;
                });
            }
            else if (isNodeJS && isCommonJS) {
                e = this.linq;
            }
            else {
                throw "Cannot find a compatible loader for importing System.Linq/Linq";
            }
        }
        if (e && callback)
            callback(e);
        return e;
    }
}
//# sourceMappingURL=CollectionBase.js.map