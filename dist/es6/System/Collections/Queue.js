/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from "../Compare";
import * as AU from "./Array/Utility";
import { Type } from "../Types";
import { Integer } from "../Integer";
import { EnumeratorBase } from "./Enumeration/EnumeratorBase";
import { NotImplementedException } from "../Exceptions/NotImplementedException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { CollectionBase } from "./CollectionBase";
const MINIMUM_GROW = 4;
const SHRINK_THRESHOLD = 32;
const GROW_FACTOR_HALF = 100;
const DEFAULT_CAPACITY = MINIMUM_GROW;
var emptyArray = [];
export class Queue extends CollectionBase {
    constructor(source, equalityComparer = areEqual) {
        super(null, equalityComparer);
        var _ = this;
        _._head = 0;
        _._tail = 0;
        _._size = 0;
        if (!source)
            _._array = emptyArray;
        else {
            if (Type.isNumber(source)) {
                var capacity = source;
                assertIntegerZeroOrGreater(capacity, "capacity");
                _._array = capacity
                    ? AU.initialize(capacity)
                    : emptyArray;
            }
            else {
                var se = source;
                _._array = AU.initialize(Type.isArrayLike(se)
                    ? se.length
                    : DEFAULT_CAPACITY);
                _._importEntries(se);
            }
        }
        _._capacity = _._array.length;
    }
    getCount() {
        return this._size;
    }
    _addInternal(item) {
        var _ = this, array = _._array, size = _._size, len = _._capacity;
        if (size == len) {
            var newCapacity = len * GROW_FACTOR_HALF;
            if (newCapacity < len + MINIMUM_GROW)
                newCapacity = len + MINIMUM_GROW;
            _.setCapacity(newCapacity);
            array = _._array;
            len = _._capacity;
        }
        var tail = _._tail;
        array[tail] = item;
        _._tail = (tail + 1) % len;
        _._size = size + 1;
        return true;
    }
    _removeInternal(item, max) {
        throw new NotImplementedException("ICollection\<T\>.remove is not implemented in Queue\<T\>" +
            " since it would require destroying the underlying array to remove the item.");
    }
    _clearInternal() {
        var _ = this, array = _._array, head = _._head, tail = _._tail, size = _._size;
        if (head < tail)
            AU.clear(array, head, tail);
        else {
            AU.clear(array, head, array.length - head);
            AU.clear(array, 0, tail);
        }
        _._head = 0;
        _._tail = 0;
        _._size = 0;
        _.trimExcess();
        return size;
    }
    _onDispose() {
        super._onDispose();
        var _ = this;
        if (_._array != emptyArray) {
            _._array.length = _._capacity = 0;
            _._array = emptyArray;
        }
    }
    dump(max = Infinity) {
        var _ = this, result = [];
        if (isFinite(max)) {
            Integer.assertZeroOrGreater(max);
            if (max !== 0) {
                while (max-- && _._size) {
                    result.push(_._dequeueInternal());
                }
            }
        }
        else {
            while (_._size) {
                result.push(_._dequeueInternal());
            }
        }
        _.trimExcess();
        _._signalModification();
        return result;
    }
    forEach(action) {
        return super.forEach(action, true);
    }
    setCapacity(capacity) {
        assertIntegerZeroOrGreater(capacity, "capacity");
        var _ = this, array = _._array, len = _._capacity;
        if (capacity == len)
            return;
        var head = _._head, tail = _._tail, size = _._size;
        if (array != emptyArray && capacity > len && head < tail) {
            array.length = _._capacity = capacity;
            _._version++;
            return;
        }
        var newArray = AU.initialize(capacity);
        if (size > 0) {
            if (head < tail) {
                AU.copyTo(array, newArray, head, 0, size);
            }
            else {
                AU.copyTo(array, newArray, head, 0, len - head);
                AU.copyTo(array, newArray, 0, len - head, tail);
            }
        }
        _._array = newArray;
        _._capacity = capacity;
        _._head = 0;
        _._tail = (size == capacity) ? 0 : size;
        _._signalModification(true);
    }
    enqueue(item) {
        this.add(item);
    }
    _dequeueInternal(throwIfEmpty = false) {
        var _ = this;
        if (_._size == 0) {
            if (throwIfEmpty)
                throw new InvalidOperationException("Cannot dequeue an empty queue.");
            return void 0;
        }
        var array = _._array, head = _._head;
        var removed = _._array[head];
        array[head] = null;
        _._head = (head + 1) % _._capacity;
        _._size--;
        _._incrementModified();
        return removed;
    }
    dequeue(throwIfEmpty = false) {
        var _ = this;
        _.assertModifiable();
        var modified = !!_._size;
        var v = this._dequeueInternal(throwIfEmpty);
        if (modified && _._size < _._capacity / 2)
            _.trimExcess(SHRINK_THRESHOLD);
        _._signalModification();
        return v;
    }
    tryDequeue(out) {
        if (!this._size)
            return false;
        var d = this.dequeue();
        if (out)
            out(d);
        return true;
    }
    _getElement(index) {
        assertIntegerZeroOrGreater(index, "index");
        var _ = this;
        return _._array[(_._head + index) % _._capacity];
    }
    peek() {
        if (this._size == 0)
            throw new InvalidOperationException("Cannot call peek on an empty queue.");
        return this._array[this._head];
    }
    trimExcess(threshold) {
        var _ = this;
        var size = _._size;
        if (size < Math.floor(_._capacity * 0.9) && (isNaN(threshold) || threshold < size))
            _.setCapacity(size);
    }
    getEnumerator() {
        var _ = this;
        var index;
        var version;
        return new EnumeratorBase(() => {
            version = _._version;
            index = 0;
        }, (yielder) => {
            _.assertVersion(version);
            if (index == _._size)
                return yielder.yieldBreak();
            return yielder.yieldReturn(_._getElement(index++));
        });
    }
}
function assertZeroOrGreater(value, property) {
    if (value < 0)
        throw new ArgumentOutOfRangeException(property, value, "Must be greater than zero");
}
function assertIntegerZeroOrGreater(value, property) {
    Integer.assert(value, property);
    assertZeroOrGreater(value, property);
}
export default Queue;
//# sourceMappingURL=Queue.js.map