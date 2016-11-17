import { areEqual } from "../Compare";
import * as AU from "./Array/Utility";
import { Type } from "../Types";
import { Integer } from "../Integer";
import { EnumeratorBase } from "./Enumeration/EnumeratorBase";
import { NotImplementedException } from "../Exceptions/NotImplementedException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { CollectionBase } from "./CollectionBase";
const VOID0 = void 0;
const MINIMUM_GROW = 4;
const SHRINK_THRESHOLD = 32;
const GROW_FACTOR_HALF = 100;
const DEFAULT_CAPACITY = MINIMUM_GROW;
const emptyArray = Object.freeze([]);
export class Queue extends CollectionBase {
    constructor(source, equalityComparer = areEqual) {
        super(VOID0, equalityComparer);
        const _ = this;
        _._head = 0;
        _._tail = 0;
        _._size = 0;
        if (!source)
            _._array = emptyArray;
        else {
            if (Type.isNumber(source)) {
                const capacity = source;
                assertIntegerZeroOrGreater(capacity, "capacity");
                _._array = capacity
                    ? AU.initialize(capacity)
                    : emptyArray;
            }
            else {
                const se = source;
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
        const _ = this;
        const size = _._size;
        let len = _._capacity;
        if (size == len) {
            let newCapacity = len * GROW_FACTOR_HALF;
            if (newCapacity < len + MINIMUM_GROW)
                newCapacity = len + MINIMUM_GROW;
            _.setCapacity(newCapacity);
            len = _._capacity;
        }
        const tail = _._tail;
        _._array[tail] = item;
        _._tail = (tail + 1) % len;
        _._size = size + 1;
        return true;
    }
    _removeInternal(item, max) {
        throw new NotImplementedException("ICollection\<T\>.remove is not implemented in Queue\<T\>" +
            " since it would require destroying the underlying array to remove the item.");
    }
    _clearInternal() {
        const _ = this;
        const array = _._array, head = _._head, tail = _._tail, size = _._size;
        if (head < tail)
            AU.clear(array, head, tail);
        else {
            AU.clear(array, head);
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
        const _ = this;
        if (_._array != emptyArray) {
            _._array.length = _._capacity = 0;
            _._array = emptyArray;
        }
    }
    dump(max = Infinity) {
        const _ = this;
        const result = [];
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
        const _ = this;
        assertIntegerZeroOrGreater(capacity, "capacity");
        const array = _._array, len = _._capacity;
        if (capacity > len)
            _.throwIfDisposed();
        if (capacity == len)
            return;
        const head = _._head, tail = _._tail, size = _._size;
        if (array != emptyArray && capacity > len && head < tail) {
            array.length = _._capacity = capacity;
            _._version++;
            return;
        }
        const newArray = AU.initialize(capacity);
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
        const _ = this;
        if (_._size == 0) {
            if (throwIfEmpty)
                throw new InvalidOperationException("Cannot dequeue an empty queue.");
            return VOID0;
        }
        const array = _._array, head = _._head;
        const removed = _._array[head];
        array[head] = null;
        _._head = (head + 1) % _._capacity;
        _._size--;
        _._incrementModified();
        return removed;
    }
    dequeue(throwIfEmpty = false) {
        const _ = this;
        _.assertModifiable();
        const modified = !!_._size;
        const v = this._dequeueInternal(throwIfEmpty);
        if (modified && _._size < _._capacity / 2)
            _.trimExcess(SHRINK_THRESHOLD);
        _._signalModification();
        return v;
    }
    tryDequeue(out) {
        if (!this._size)
            return false;
        const d = this.dequeue();
        if (out)
            out(d);
        return true;
    }
    _getElement(index) {
        assertIntegerZeroOrGreater(index, "index");
        const _ = this;
        return _._array[(_._head + index) % _._capacity];
    }
    peek() {
        if (this._size == 0)
            throw new InvalidOperationException("Cannot call peek on an empty queue.");
        return this._array[this._head];
    }
    trimExcess(threshold) {
        const _ = this;
        const size = _._size;
        if (size < Math.floor(_._capacity * 0.9) && (!threshold && threshold !== 0 || isNaN(threshold) || threshold < size))
            _.setCapacity(size);
    }
    getEnumerator() {
        const _ = this;
        _.throwIfDisposed();
        let index, version, size;
        return new EnumeratorBase(() => {
            version = _._version;
            size = _._size;
            index = 0;
        }, (yielder) => {
            _.throwIfDisposed();
            _.assertVersion(version);
            if (index == size)
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