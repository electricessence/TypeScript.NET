/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as Values from "../System/Compare";
import * as Arrays from "../System/Collections/Array/Compare";
import * as ArrayUtility from "../System/Collections/Array/Utility";
import { from as enumeratorFrom, forEach, toArray, map, isEnumerable, throwIfEndless } from "../System/Collections/Enumeration/Enumerator";
import { EmptyEnumerator } from "../System/Collections/Enumeration/EmptyEnumerator";
import { Type } from "../System/Types";
import { Integer } from "../System/Integer";
import { Functions as BaseFunctions } from "../System/Functions";
import { ArrayEnumerator } from "../System/Collections/Enumeration/ArrayEnumerator";
import { EnumeratorBase } from "../System/Collections/Enumeration/EnumeratorBase";
import { Dictionary } from "../System/Collections/Dictionaries/Dictionary";
import { Queue } from "../System/Collections/Queue";
import { dispose, using } from "../System/Disposable/dispose";
import { DisposableBase } from "../System/Disposable/DisposableBase";
import { UnsupportedEnumerableException } from "../System/Collections/Enumeration/UnsupportedEnumerableException";
import { ObjectDisposedException } from "../System/Disposable/ObjectDisposedException";
import { KeySortedContext } from "../System/Collections/Sorting/KeySortedContext";
import { ArgumentNullException } from "../System/Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../System/Exceptions/ArgumentOutOfRangeException";
const INVALID_DEFAULT = {};
const VOID0 = void 0;
const BREAK = element => 0;
class LinqFunctions extends BaseFunctions {
    Greater(a, b) {
        return a > b ? a : b;
    }
    Lesser(a, b) {
        return a < b ? a : b;
    }
}
var Functions = new LinqFunctions();
Object.freeze(Functions);
function getEmptyEnumerator() {
    return EmptyEnumerator;
}
export class InfiniteEnumerable extends DisposableBase {
    constructor(_enumeratorFactory, finalizer) {
        super(finalizer);
        this._enumeratorFactory = _enumeratorFactory;
        this._isEndless = true;
    }
    get isEndless() {
        return this._isEndless;
    }
    getEnumerator() {
        this.throwIfDisposed();
        return this._enumeratorFactory();
    }
    _onDispose() {
        super._onDispose();
        this._enumeratorFactory = null;
    }
    asEnumerable() {
        var _ = this;
        _.throwIfDisposed();
        return new InfiniteEnumerable(() => _.getEnumerator());
    }
    doAction(action, initializer, isEndless = this.isEndless) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            var index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                if (initializer)
                    initializer();
                index = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    var actionResult = action(enumerator.current, index++);
                    if (actionResult === false || actionResult === 0)
                        return yielder.yieldBreak();
                    if (actionResult !== 2)
                        return yielder.yieldReturn(enumerator.current);
                }
                return false;
            }, () => {
                dispose(enumerator);
            }, isEndless);
        }, () => {
            disposed = true;
        }, isEndless);
    }
    force() {
        this.throwIfDisposed();
        this.doAction(BREAK)
            .getEnumerator()
            .moveNext();
    }
    skip(count) {
        var _ = this;
        _.throwIfDisposed();
        if (!isFinite(count))
            return Enumerable.empty();
        Integer.assert(count, "count");
        return this.doAction((element, index) => index < count
            ? 2
            : 1);
    }
    take(count) {
        if (!(count > 0))
            return Enumerable.empty();
        var _ = this;
        _.throwIfDisposed();
        if (!isFinite(count))
            throw new ArgumentOutOfRangeException('count', count, 'Must be finite.');
        Integer.assert(count, "count");
        return _.doAction((element, index) => index < count, null, false);
    }
    elementAt(index) {
        var v = this.elementAtOrDefault(index, INVALID_DEFAULT);
        if (v === INVALID_DEFAULT)
            throw new ArgumentOutOfRangeException('index', index, "is greater than or equal to the number of elements in source");
        return v;
    }
    elementAtOrDefault(index, defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        Integer.assertZeroOrGreater(index, 'index');
        var n = index;
        return using(this.getEnumerator(), e => {
            var i = 0;
            while (e.moveNext()) {
                if (i == n)
                    return e.current;
                i++;
            }
            return defaultValue;
        });
    }
    first() {
        var v = this.firstOrDefault(INVALID_DEFAULT);
        if (v === INVALID_DEFAULT)
            throw new Error("first:The sequence is empty.");
        return v;
    }
    firstOrDefault(defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        return using(this.getEnumerator(), e => e.moveNext() ? e.current : defaultValue);
    }
    single() {
        var _ = this;
        _.throwIfDisposed();
        return using(this.getEnumerator(), e => {
            if (e.moveNext()) {
                var value = e.current;
                if (!e.moveNext())
                    return value;
                throw new Error("single:sequence contains more than one element.");
            }
            throw new Error("single:The sequence is empty.");
        });
    }
    singleOrDefault(defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        return using(this.getEnumerator(), e => {
            if (e.moveNext()) {
                var value = e.current;
                if (!e.moveNext())
                    return value;
            }
            return defaultValue;
        });
    }
    any() {
        var _ = this;
        _.throwIfDisposed();
        return using(this.getEnumerator(), e => e.moveNext());
    }
    isEmpty() {
        return !this.any();
    }
    traverseBreadthFirst(childrenSelector, resultSelector = Functions.Identity) {
        var _ = this, isEndless = _._isEndless || null;
        return new Enumerable(() => {
            var enumerator;
            var nestLevel = 0;
            var buffer, len;
            return new EnumeratorBase(() => {
                nestLevel = 0;
                buffer = [];
                len = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                while (true) {
                    if (enumerator.moveNext()) {
                        buffer[len++] = enumerator.current;
                        return yielder.yieldReturn(resultSelector(enumerator.current, nestLevel));
                    }
                    if (!len)
                        return yielder.yieldBreak();
                    var next = Enumerable
                        .from(buffer)
                        .selectMany(childrenSelector);
                    if (!next.any()) {
                        return yielder.yieldBreak();
                    }
                    else {
                        nestLevel++;
                        buffer = [];
                        len = 0;
                        enumerator.dispose();
                        enumerator = next.getEnumerator();
                    }
                }
            }, () => {
                dispose(enumerator);
                buffer.length = 0;
            }, isEndless);
        }, null, isEndless);
    }
    traverseDepthFirst(childrenSelector, resultSelector = Functions.Identity) {
        var _ = this, isEndless = _._isEndless || null;
        return new Enumerable(() => {
            var enumeratorStack = [];
            var enumerator;
            var len;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                len = 0;
            }, (yielder) => {
                while (true) {
                    if (enumerator.moveNext()) {
                        let value = resultSelector(enumerator.current, len);
                        enumeratorStack[len++] = enumerator;
                        let e = Enumerable.fromAny(childrenSelector(enumerator.current));
                        enumerator = e ? e.getEnumerator() : EmptyEnumerator;
                        return yielder.yieldReturn(value);
                    }
                    if (len == 0)
                        return false;
                    enumerator.dispose();
                    enumerator = enumeratorStack[--len];
                    enumeratorStack.length = len;
                }
            }, () => {
                try {
                    dispose(enumerator);
                }
                finally {
                    dispose.these(enumeratorStack);
                }
            }, isEndless);
        }, null, isEndless);
    }
    flatten() {
        var _ = this, isEndless = _._isEndless || null;
        return new Enumerable(() => {
            var enumerator;
            var middleEnumerator = null;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
            }, (yielder) => {
                while (true) {
                    if (middleEnumerator) {
                        if (middleEnumerator.moveNext()) {
                            return yielder.yieldReturn(middleEnumerator.current);
                        }
                        else {
                            middleEnumerator.dispose();
                            middleEnumerator = null;
                        }
                    }
                    if (enumerator.moveNext()) {
                        var c = enumerator.current;
                        var e = !Type.isString(c) && Enumerable.fromAny(c);
                        if (e) {
                            middleEnumerator
                                = e
                                    .selectMany(Functions.Identity)
                                    .flatten()
                                    .getEnumerator();
                            continue;
                        }
                        else {
                            return yielder.yieldReturn(c);
                        }
                    }
                    return yielder.yieldBreak();
                }
            }, () => {
                dispose(enumerator, middleEnumerator);
            }, isEndless);
        }, null, isEndless);
    }
    pairwise(selector) {
        var _ = this;
        return new Enumerable(() => {
            var enumerator;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                enumerator.moveNext();
            }, (yielder) => {
                var prev = enumerator.current;
                return enumerator.moveNext()
                    && yielder.yieldReturn(selector(prev, enumerator.current));
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, null, _._isEndless);
    }
    scan(func, seed) {
        var isUseSeed = seed !== VOID0;
        var _ = this;
        return new Enumerable(() => {
            var enumerator;
            var value;
            var isFirst;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                isFirst = true;
            }, (yielder) => {
                if (isFirst) {
                    isFirst = false;
                    return isUseSeed
                        ? yielder.yieldReturn(value = seed)
                        : enumerator.moveNext() && yielder.yieldReturn(value
                            = enumerator.current);
                }
                return (enumerator.moveNext())
                    ? yielder.yieldReturn(value = func(value, enumerator.current))
                    : false;
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, null, _._isEndless);
    }
    select(selector) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            var index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                index = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                return enumerator.moveNext()
                    ? yielder.yieldReturn(selector(enumerator.current, index++))
                    : yielder.yieldBreak();
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, () => {
            disposed = true;
        }, _._isEndless);
    }
    _selectMany(collectionSelector, resultSelector) {
        var _ = this, isEndless = _._isEndless || null;
        if (!resultSelector)
            resultSelector = (a, b) => b;
        return new Enumerable(() => {
            var enumerator;
            var middleEnumerator;
            var index = 0;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                middleEnumerator = undefined;
                index = 0;
            }, (yielder) => {
                if (middleEnumerator === VOID0 && !enumerator.moveNext())
                    return false;
                do {
                    if (!middleEnumerator) {
                        var middleSeq = collectionSelector(enumerator.current, index++);
                        if (!middleSeq)
                            continue;
                        middleEnumerator = enumeratorFrom(middleSeq);
                    }
                    if (middleEnumerator.moveNext())
                        return yielder.yieldReturn(resultSelector(enumerator.current, middleEnumerator.current));
                    middleEnumerator.dispose();
                    middleEnumerator = null;
                } while (enumerator.moveNext());
                return false;
            }, () => {
                dispose(enumerator, middleEnumerator);
                enumerator = null;
                middleEnumerator = null;
            }, isEndless);
        }, null, isEndless);
    }
    selectMany(collectionSelector, resultSelector) {
        return this._selectMany(collectionSelector, resultSelector);
    }
    _choose(selector) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            var index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                index = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    var result = selector(enumerator.current, index++);
                    if (result !== null && result !== VOID0)
                        return yielder.yieldReturn(result);
                }
                return false;
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, () => {
            disposed = true;
        }, _._isEndless);
    }
    choose(selector = Functions.Identity) {
        return this._choose(selector);
    }
    where(predicate) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            var index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                index = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    if (predicate(enumerator.current, index++))
                        return yielder.yieldReturn(enumerator.current);
                }
                return false;
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, () => {
            disposed = true;
        }, _._isEndless);
    }
    ofType(type) {
        var typeName;
        switch (type) {
            case Number:
                typeName = Type.NUMBER;
                break;
            case String:
                typeName = Type.STRING;
                break;
            case Boolean:
                typeName = Type.BOOLEAN;
                break;
            case Function:
                typeName = Type.FUNCTION;
                break;
            default:
                return this
                    .where(x => x instanceof type);
        }
        return this
            .choose()
            .where(x => (typeof x) === typeName);
    }
    except(second, compareSelector) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            var keys;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
                keys = new Dictionary(compareSelector);
                if (second)
                    forEach(second, key => { keys.addByKeyValue(key, true); });
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    var current = enumerator.current;
                    if (!keys.containsKey(current)) {
                        keys.addByKeyValue(current, true);
                        return yielder.yieldReturn(current);
                    }
                }
                return false;
            }, () => {
                dispose(enumerator);
                keys.clear();
            }, _._isEndless);
        }, () => {
            disposed = true;
        }, _._isEndless);
    }
    distinct(compareSelector) {
        return this.except(null, compareSelector);
    }
    distinctUntilChanged(compareSelector = Functions.Identity) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            var compareKey;
            var initial = true;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    var key = compareSelector(enumerator.current);
                    if (initial) {
                        initial = false;
                    }
                    else if (Values.areEqual(compareKey, key)) {
                        continue;
                    }
                    compareKey = key;
                    return yielder.yieldReturn(enumerator.current);
                }
                return false;
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, () => {
            disposed = true;
        }, _._isEndless);
    }
    defaultIfEmpty(defaultValue = null) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            var isFirst;
            return new EnumeratorBase(() => {
                isFirst = true;
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                if (enumerator.moveNext()) {
                    isFirst = false;
                    return yielder.yieldReturn(enumerator.current);
                }
                else if (isFirst) {
                    isFirst = false;
                    return yielder.yieldReturn(defaultValue);
                }
                return false;
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, null, _._isEndless);
    }
    zip(second, resultSelector) {
        var _ = this;
        _.throwIfDisposed();
        return new Enumerable(() => {
            var firstEnumerator;
            var secondEnumerator;
            var index = 0;
            return new EnumeratorBase(() => {
                index = 0;
                firstEnumerator = _.getEnumerator();
                secondEnumerator = enumeratorFrom(second);
            }, (yielder) => firstEnumerator.moveNext()
                && secondEnumerator.moveNext()
                && yielder.yieldReturn(resultSelector(firstEnumerator.current, secondEnumerator.current, index++)), () => {
                dispose(firstEnumerator, secondEnumerator);
            });
        });
    }
    zipMultiple(second, resultSelector) {
        var _ = this;
        _.throwIfDisposed();
        if (!second.length)
            return Enumerable.empty();
        return new Enumerable(() => {
            var secondTemp;
            var firstEnumerator;
            var secondEnumerator;
            var index = 0;
            return new EnumeratorBase(() => {
                secondTemp = new Queue(second);
                index = 0;
                firstEnumerator = _.getEnumerator();
                secondEnumerator = null;
            }, (yielder) => {
                if (firstEnumerator.moveNext()) {
                    while (true) {
                        while (!secondEnumerator) {
                            if (secondTemp.count) {
                                var next = secondTemp.dequeue();
                                if (next)
                                    secondEnumerator = enumeratorFrom(next);
                            }
                            else
                                return yielder.yieldBreak();
                        }
                        if (secondEnumerator.moveNext())
                            return yielder.yieldReturn(resultSelector(firstEnumerator.current, secondEnumerator.current, index++));
                        secondEnumerator.dispose();
                        secondEnumerator = null;
                    }
                }
                return yielder.yieldBreak();
            }, () => {
                dispose(firstEnumerator, secondTemp);
            });
        });
    }
    join(inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector = Functions.Identity) {
        var _ = this;
        return new Enumerable(() => {
            var outerEnumerator;
            var lookup;
            var innerElements = null;
            var innerCount = 0;
            return new EnumeratorBase(() => {
                outerEnumerator = _.getEnumerator();
                lookup = Enumerable.from(inner)
                    .toLookup(innerKeySelector, Functions.Identity, compareSelector);
            }, (yielder) => {
                while (true) {
                    if (innerElements != null) {
                        var innerElement = innerElements[innerCount++];
                        if (innerElement !== VOID0)
                            return yielder.yieldReturn(resultSelector(outerEnumerator.current, innerElement));
                        innerElement = null;
                        innerCount = 0;
                    }
                    if (outerEnumerator.moveNext()) {
                        var key = outerKeySelector(outerEnumerator.current);
                        innerElements = lookup.get(key);
                    }
                    else {
                        return yielder.yieldBreak();
                    }
                }
            }, () => {
                dispose(outerEnumerator);
            });
        });
    }
    groupJoin(inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector = Functions.Identity) {
        var _ = this;
        return new Enumerable(() => {
            var enumerator;
            var lookup = null;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                lookup = Enumerable.from(inner)
                    .toLookup(innerKeySelector, Functions.Identity, compareSelector);
            }, (yielder) => enumerator.moveNext()
                && yielder.yieldReturn(resultSelector(enumerator.current, lookup.get(outerKeySelector(enumerator.current)))), () => {
                dispose(enumerator);
            });
        });
    }
    merge(enumerables) {
        var _ = this, isEndless = _._isEndless || null;
        if (!enumerables || enumerables.length == 0)
            return _;
        return new Enumerable(() => {
            var enumerator;
            var queue;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                queue = new Queue(enumerables);
            }, (yielder) => {
                while (true) {
                    while (!enumerator && queue.count) {
                        enumerator = enumeratorFrom(queue.dequeue());
                    }
                    if (enumerator && enumerator.moveNext())
                        return yielder.yieldReturn(enumerator.current);
                    if (enumerator) {
                        enumerator.dispose();
                        enumerator = null;
                        continue;
                    }
                    return yielder.yieldBreak();
                }
            }, () => {
                dispose(enumerator, queue);
            }, isEndless);
        }, null, isEndless);
    }
    concat(...enumerables) {
        return this.merge(enumerables);
    }
    union(second, compareSelector = Functions.Identity) {
        var _ = this, isEndless = _._isEndless || null;
        return new Enumerable(() => {
            var firstEnumerator;
            var secondEnumerator;
            var keys;
            return new EnumeratorBase(() => {
                firstEnumerator = _.getEnumerator();
                keys = new Dictionary(compareSelector);
            }, (yielder) => {
                var current;
                if (secondEnumerator === VOID0) {
                    while (firstEnumerator.moveNext()) {
                        current = firstEnumerator.current;
                        if (!keys.containsKey(current)) {
                            keys.addByKeyValue(current, null);
                            return yielder.yieldReturn(current);
                        }
                    }
                    secondEnumerator = enumeratorFrom(second);
                }
                while (secondEnumerator.moveNext()) {
                    current = secondEnumerator.current;
                    if (!keys.containsKey(current)) {
                        keys.addByKeyValue(current, null);
                        return yielder.yieldReturn(current);
                    }
                }
                return false;
            }, () => {
                dispose(firstEnumerator, secondEnumerator);
            }, isEndless);
        }, null, isEndless);
    }
    insertAt(index, other) {
        Integer.assertZeroOrGreater(index, 'index');
        var n = index;
        var _ = this, isEndless = _._isEndless || null;
        _.throwIfDisposed();
        return new Enumerable(() => {
            var firstEnumerator;
            var secondEnumerator;
            var count = 0;
            var isEnumerated = false;
            return new EnumeratorBase(() => {
                count = 0;
                firstEnumerator = _.getEnumerator();
                secondEnumerator = enumeratorFrom(other);
                isEnumerated = false;
            }, (yielder) => {
                if (count == n) {
                    isEnumerated = true;
                    if (secondEnumerator.moveNext())
                        return yielder.yieldReturn(secondEnumerator.current);
                }
                if (firstEnumerator.moveNext()) {
                    count++;
                    return yielder.yieldReturn(firstEnumerator.current);
                }
                return !isEnumerated
                    && secondEnumerator.moveNext()
                    && yielder.yieldReturn(secondEnumerator.current);
            }, () => {
                dispose(firstEnumerator, secondEnumerator);
            }, isEndless);
        }, null, isEndless);
    }
    alternateMultiple(sequence) {
        var _ = this;
        return new Enumerable(() => {
            var buffer, mode, enumerator, alternateEnumerator;
            return new EnumeratorBase(() => {
                alternateEnumerator = new ArrayEnumerator(Enumerable.toArray(sequence));
                enumerator = _.getEnumerator();
                var hasAtLeastOne = enumerator.moveNext();
                mode = hasAtLeastOne
                    ? 1
                    : 0;
                if (hasAtLeastOne)
                    buffer = enumerator.current;
            }, (yielder) => {
                switch (mode) {
                    case 0:
                        return yielder.yieldBreak();
                    case 2:
                        if (alternateEnumerator.moveNext())
                            return yielder.yieldReturn(alternateEnumerator.current);
                        alternateEnumerator.reset();
                        mode = 1;
                        break;
                }
                var latest = buffer;
                var another = enumerator.moveNext();
                mode = another
                    ? 2
                    : 0;
                if (another)
                    buffer = enumerator.current;
                return yielder.yieldReturn(latest);
            }, () => {
                dispose(enumerator, alternateEnumerator);
            }, _._isEndless);
        }, null, _._isEndless);
    }
    alternateSingle(value) {
        return this.alternateMultiple(Enumerable.make(value));
    }
    alternate(...sequence) {
        return this.alternateMultiple(sequence);
    }
    catchError(handler) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            return new EnumeratorBase(() => {
                try {
                    throwIfDisposed(disposed);
                    enumerator = _.getEnumerator();
                }
                catch (e) {
                }
            }, (yielder) => {
                try {
                    throwIfDisposed(disposed);
                    if (enumerator.moveNext())
                        return yielder.yieldReturn(enumerator.current);
                }
                catch (e) {
                    handler(e);
                }
                return false;
            }, () => {
                dispose(enumerator);
            });
        });
    }
    finallyAction(action) {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var enumerator;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                return (enumerator.moveNext())
                    ? yielder.yieldReturn(enumerator.current)
                    : false;
            }, () => {
                try {
                    dispose(enumerator);
                }
                finally {
                    action();
                }
            });
        });
    }
    buffer(size) {
        if (size < 1 || !isFinite(size))
            throw new Error("Invalid buffer size.");
        Integer.assert(size, "size");
        var _ = this, len;
        return new Enumerable(() => {
            var enumerator;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
            }, (yielder) => {
                var array = ArrayUtility.initialize(size);
                len = 0;
                while (len < size && enumerator.moveNext()) {
                    array[len++] = enumerator.current;
                }
                array.length = len;
                return len && yielder.yieldReturn(array);
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, null, _._isEndless);
    }
    share() {
        var _ = this;
        _.throwIfDisposed();
        var sharedEnumerator;
        return new Enumerable(() => {
            return sharedEnumerator || (sharedEnumerator = _.getEnumerator());
        }, () => {
            dispose(sharedEnumerator);
        }, _._isEndless);
    }
}
export class Enumerable extends InfiniteEnumerable {
    constructor(enumeratorFactory, finalizer, isEndless = null) {
        super(enumeratorFactory, finalizer);
        this._isEndless = isEndless;
    }
    static from(source) {
        var e = Enumerable.fromAny(source);
        if (!e)
            throw new UnsupportedEnumerableException();
        return e;
    }
    static fromAny(source, defaultEnumerable = null) {
        if (Type.isObject(source) || Type.isString(source)) {
            if (source instanceof Enumerable)
                return source;
            if (Type.isArrayLike(source))
                return new ArrayEnumerable(source);
            if (isEnumerable(source))
                return new Enumerable(() => source.getEnumerator(), null, source.isEndless);
        }
        return defaultEnumerable;
    }
    static fromOrEmpty(source) {
        return Enumerable.fromAny(source) || Enumerable.empty();
    }
    static toArray(source) {
        if (source instanceof Enumerable)
            return source.toArray();
        return toArray(source);
    }
    static choice(values) {
        var len = values && values.length;
        if (!len || !isFinite(len))
            throw new ArgumentOutOfRangeException('length', length);
        return new InfiniteEnumerable(() => new EnumeratorBase(null, (yielder) => yielder.yieldReturn(Integer.random.select(values)), true));
    }
    static chooseFrom(...args) {
        return Enumerable.choice(args);
    }
    static cycle(values) {
        var len = values && values.length;
        if (!len || !isFinite(len))
            throw new ArgumentOutOfRangeException('length', length);
        return new InfiniteEnumerable(() => {
            var index = 0;
            return new EnumeratorBase(() => {
                index = 0;
            }, (yielder) => {
                if (index >= values.length)
                    index = 0;
                return yielder.yieldReturn(values[index++]);
            }, true);
        });
    }
    static cycleThrough(...args) {
        return Enumerable.cycle(args);
    }
    static empty() {
        return new FiniteEnumerable(getEmptyEnumerator);
    }
    static repeat(element, count = Infinity) {
        if (!(count > 0))
            return Enumerable.empty();
        return isFinite(count) && Integer.assert(count, "count")
            ? new FiniteEnumerable(() => {
                var c = count;
                var index = 0;
                return new EnumeratorBase(() => { index = 0; }, (yielder) => (index++ < c) && yielder.yieldReturn(element), null, false);
            })
            : new Enumerable(() => new EnumeratorBase(null, (yielder) => yielder.yieldReturn(element), true));
    }
    static repeatWithFinalize(initializer, finalizer) {
        return new InfiniteEnumerable(() => {
            var element;
            return new EnumeratorBase(() => {
                element = initializer();
            }, (yielder) => yielder.yieldReturn(element), () => {
                finalizer(element);
            }, true);
        });
    }
    static make(element) {
        return Enumerable.repeat(element, 1);
    }
    static range(start, count, step = 1) {
        if (!isFinite(start))
            throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");
        if (!(count > 0))
            return Enumerable.empty();
        if (!step)
            throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");
        if (!isFinite(step))
            throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");
        Integer.assert(count, "count");
        return new FiniteEnumerable(() => {
            var value;
            var c = count;
            var index = 0;
            return new EnumeratorBase(() => {
                index = 0;
                value = start;
            }, (yielder) => {
                var result = index++ < c
                    && yielder.yieldReturn(value);
                if (result && index < count)
                    value += step;
                return result;
            }, false);
        });
    }
    static rangeDown(start, count, step = 1) {
        step = Math.abs(step) * -1;
        return Enumerable.range(start, count, step);
    }
    static toInfinity(start = 0, step = 1) {
        if (!isFinite(start))
            throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");
        if (!step)
            throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");
        if (!isFinite(step))
            throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");
        return new InfiniteEnumerable(() => {
            var value;
            return new EnumeratorBase(() => {
                value = start;
            }, (yielder) => {
                var current = value;
                value += step;
                return yielder.yieldReturn(current);
            }, true);
        });
    }
    static toNegativeInfinity(start = 0, step = 1) {
        return Enumerable.toInfinity(start, -step);
    }
    static rangeTo(start, to, step = 1) {
        if (isNaN(to) || !isFinite(to))
            throw new ArgumentOutOfRangeException("to", to, "Must be a finite number.");
        if (step && !isFinite(step))
            throw new ArgumentOutOfRangeException("step", step, "Must be a finite non-zero number.");
        step = Math.abs(step);
        return new FiniteEnumerable(() => {
            var value;
            return new EnumeratorBase(() => { value = start; }, start < to
                ?
                    yielder => {
                        var result = value <= to && yielder.yieldReturn(value);
                        if (result)
                            value += step;
                        return result;
                    }
                :
                    yielder => {
                        var result = value >= to && yielder.yieldReturn(value);
                        if (result)
                            value -= step;
                        return result;
                    }, false);
        });
    }
    static matches(input, pattern, flags = "") {
        if (input === null || input === VOID0)
            throw new ArgumentNullException("input");
        var type = typeof input;
        if (type != Type.STRING)
            throw new Error("Cannot exec RegExp matches of type '" + type + "'.");
        if (pattern instanceof RegExp) {
            flags += (pattern.ignoreCase) ? "i" : "";
            flags += (pattern.multiline) ? "m" : "";
            pattern = pattern.source;
        }
        if (flags.indexOf("g") === -1)
            flags += "g";
        return new FiniteEnumerable(() => {
            var regex;
            return new EnumeratorBase(() => {
                regex = new RegExp(pattern, flags);
            }, (yielder) => {
                var match = regex.exec(input);
                return (match !== null) ? yielder.yieldReturn(match) : false;
            });
        });
    }
    static generate(factory, count = Infinity) {
        if (isNaN(count) || count <= 0)
            return Enumerable.empty();
        return isFinite(count) && Integer.assert(count, "count")
            ?
                new FiniteEnumerable(() => {
                    var c = count;
                    var index = 0;
                    return new EnumeratorBase(() => {
                        index = 0;
                    }, (yielder) => {
                        var current = index++;
                        return current < c && yielder.yieldReturn(factory(current));
                    }, false);
                })
            :
                new InfiniteEnumerable(() => {
                    var index = 0;
                    return new EnumeratorBase(() => {
                        index = 0;
                    }, (yielder) => yielder.yieldReturn(factory(index++)), true);
                });
    }
    static unfold(seed, valueFactory, skipSeed = false) {
        return new InfiniteEnumerable(() => {
            var index = 0;
            var value;
            var isFirst;
            return new EnumeratorBase(() => {
                index = 0;
                value = seed;
                isFirst = !skipSeed;
            }, (yielder) => {
                var i = index++;
                if (isFirst)
                    isFirst = false;
                else
                    value = valueFactory(value, i);
                return yielder.yieldReturn(value);
            }, true);
        });
    }
    static forEach(enumerable, action, max = Infinity) {
        return forEach(enumerable, action, max);
    }
    static map(enumerable, selector) {
        return map(enumerable, selector);
    }
    static max(values) {
        return values
            .takeUntil(v => v == +Infinity, true)
            .aggregate(Functions.Greater);
    }
    static min(values) {
        return values
            .takeUntil(v => v == -Infinity, true)
            .aggregate(Functions.Lesser);
    }
    static weave(enumerables) {
        if (!enumerables)
            throw new ArgumentNullException('enumerables');
        return new Enumerable(() => {
            var queue;
            var mainEnumerator;
            var index;
            return new EnumeratorBase(() => {
                index = 0;
                queue = new Queue();
                mainEnumerator = enumeratorFrom(enumerables);
            }, (yielder) => {
                let e;
                if (mainEnumerator) {
                    while (!e && mainEnumerator.moveNext()) {
                        let c = mainEnumerator.current;
                        e = nextEnumerator(queue, c && enumeratorFrom(c));
                    }
                    if (!e)
                        mainEnumerator = null;
                }
                while (!e && queue.count) {
                    e = nextEnumerator(queue, queue.dequeue());
                }
                return e
                    ? yielder.yieldReturn(e.current)
                    : yielder.yieldBreak();
            }, () => {
                dispose.these(queue.dump());
                dispose(mainEnumerator, queue);
                mainEnumerator = null;
                queue = null;
            });
        });
    }
    doAction(action, initializer, isEndless = this.isEndless) {
        return super.doAction(action, initializer, isEndless);
    }
    skip(count) {
        return super.skip(count);
    }
    skipWhile(predicate) {
        this.throwIfDisposed();
        return this.doAction((element, index) => predicate(element, index)
            ? 2
            : 1);
    }
    takeWhile(predicate) {
        this.throwIfDisposed();
        if (!predicate)
            throw new ArgumentNullException('predicate');
        return this.doAction((element, index) => predicate(element, index)
            ? 1
            : 0, null, null);
    }
    takeUntil(predicate, includeUntilValue) {
        this.throwIfDisposed();
        if (!predicate)
            throw new ArgumentNullException('predicate');
        if (!includeUntilValue)
            return this.doAction((element, index) => predicate(element, index)
                ? 0
                : 1, null, null);
        var found = false;
        return this.doAction((element, index) => {
            if (found)
                return 0;
            found = predicate(element, index);
            return 1;
        }, () => {
            found = false;
        }, null);
    }
    forEach(action) {
        var _ = this;
        _.throwIfDisposed();
        throwIfEndless(_.isEndless);
        var index = 0;
        using(_.getEnumerator(), e => {
            throwIfEndless(e.isEndless);
            while (_.throwIfDisposed() && e.moveNext()) {
                if (action(e.current, index++) === false)
                    break;
            }
        });
    }
    toArray(predicate) {
        return predicate
            ? this.where(predicate).toArray()
            : this.copyTo([]);
    }
    copyTo(target, index = 0, count = Infinity) {
        this.throwIfDisposed();
        if (!target)
            throw new ArgumentNullException("target");
        Integer.assertZeroOrGreater(index);
        forEach(this, (x, i) => {
            target[i + index] = x;
        }, count);
        return target;
    }
    toLookup(keySelector, elementSelector = Functions.Identity, compareSelector = Functions.Identity) {
        var dict = new Dictionary(compareSelector);
        this.forEach(x => {
            var key = keySelector(x);
            var element = elementSelector(x);
            var array = dict.getValue(key);
            if (array !== VOID0)
                array.push(element);
            else
                dict.addByKeyValue(key, [element]);
        });
        return new Lookup(dict);
    }
    toMap(keySelector, elementSelector) {
        var obj = {};
        this.forEach((x, i) => {
            obj[keySelector(x, i)] = elementSelector(x, i);
        });
        return obj;
    }
    toDictionary(keySelector, elementSelector, compareSelector = Functions.Identity) {
        var dict = new Dictionary(compareSelector);
        this.forEach((x, i) => dict.addByKeyValue(keySelector(x, i), elementSelector(x, i)));
        return dict;
    }
    toJoinedString(separator = "", selector = Functions.Identity) {
        return this.select(selector).toArray().join(separator);
    }
    takeExceptLast(count = 1) {
        var _ = this;
        if (!(count > 0))
            return _;
        if (!isFinite(count))
            return Enumerable.empty();
        Integer.assert(count, "count");
        var c = count;
        return new Enumerable(() => {
            var enumerator;
            var q;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                q = new Queue();
            }, (yielder) => {
                while (enumerator.moveNext()) {
                    q.enqueue(enumerator.current);
                    if (q.count > c)
                        return yielder.yieldReturn(q.dequeue());
                }
                return false;
            }, () => {
                dispose(enumerator, q);
            });
        });
    }
    skipToLast(count) {
        if (!(count > 0))
            return Enumerable.empty();
        var _ = this;
        if (!isFinite(count))
            return _;
        Integer.assert(count, "count");
        return _.reverse()
            .take(count)
            .reverse();
    }
    where(predicate) {
        return super.where(predicate);
    }
    select(selector) {
        return super.select(selector);
    }
    selectMany(collectionSelector, resultSelector) {
        return this._selectMany(collectionSelector, resultSelector);
    }
    choose(selector = Functions.Identity) {
        return this._choose(selector);
    }
    reverse() {
        var _ = this, disposed = !_.throwIfDisposed();
        throwIfEndless(_._isEndless);
        return new Enumerable(() => {
            var buffer;
            var index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                buffer = _.toArray();
                index = buffer.length;
            }, (yielder) => index && yielder.yieldReturn(buffer[--index]), () => {
                buffer.length = 0;
            });
        }, () => {
            disposed = true;
        });
    }
    shuffle() {
        var _ = this, disposed = !_.throwIfDisposed();
        throwIfEndless(_._isEndless);
        return new Enumerable(() => {
            var buffer;
            var capacity;
            var len;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                buffer = _.toArray();
                capacity = len = buffer.length;
            }, (yielder) => {
                if (!len)
                    return yielder.yieldBreak();
                var selectedIndex = Integer.random(len);
                var selectedValue = buffer[selectedIndex];
                buffer[selectedIndex] = buffer[--len];
                buffer[len] = null;
                if (len % 32 == 0)
                    buffer.length = len;
                return yielder.yieldReturn(selectedValue);
            }, () => {
                buffer.length = 0;
            });
        }, () => {
            disposed = true;
        });
    }
    count(predicate) {
        var count = 0;
        this.forEach(predicate
            ?
                    (x, i) => {
                    if (predicate(x, i))
                        ++count;
                }
            :
                    () => {
                    ++count;
                });
        return count;
    }
    all(predicate) {
        if (!predicate)
            throw new ArgumentNullException("predicate");
        var result = true;
        this.forEach((x, i) => {
            if (!predicate(x, i)) {
                result = false;
                return false;
            }
        });
        return result;
    }
    every(predicate) {
        return this.all(predicate);
    }
    any(predicate) {
        if (!predicate)
            return super.any();
        var result = false;
        this.forEach((x, i) => {
            result = predicate(x, i);
            return !result;
        });
        return result;
    }
    some(predicate) {
        return this.any(predicate);
    }
    contains(value, compareSelector) {
        return compareSelector
            ? this.any(v => compareSelector(v) === compareSelector(value))
            : this.any(v => v === value);
    }
    indexOf(value, compareSelector) {
        var found = -1;
        this.forEach(compareSelector
            ?
                    (element, i) => {
                    if (Values.areEqual(compareSelector(element, i), compareSelector(value, i), true)) {
                        found = i;
                        return false;
                    }
                }
            :
                    (element, i) => {
                    if (Values.areEqual(element, value, true)) {
                        found = i;
                        return false;
                    }
                });
        return found;
    }
    lastIndexOf(value, compareSelector) {
        var result = -1;
        this.forEach(compareSelector
            ?
                    (element, i) => {
                    if (Values.areEqual(compareSelector(element, i), compareSelector(value, i), true))
                        result
                            = i;
                }
            :
                    (element, i) => {
                    if (Values.areEqual(element, value, true))
                        result = i;
                });
        return result;
    }
    merge(enumerables) {
        return super.merge(enumerables);
    }
    concat(...enumerables) {
        return this.merge(enumerables);
    }
    intersect(second, compareSelector) {
        var _ = this;
        return new Enumerable(() => {
            var enumerator;
            var keys;
            var outs;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                keys = new Dictionary(compareSelector);
                outs = new Dictionary(compareSelector);
                forEach(second, key => {
                    keys.addByKeyValue(key, true);
                });
            }, (yielder) => {
                while (enumerator.moveNext()) {
                    var current = enumerator.current;
                    if (!outs.containsKey(current) && keys.containsKey(current)) {
                        outs.addByKeyValue(current, true);
                        return yielder.yieldReturn(current);
                    }
                }
                return yielder.yieldBreak();
            }, () => {
                dispose(enumerator, keys, outs);
            }, _._isEndless);
        }, null, _._isEndless);
    }
    sequenceEqual(second, equalityComparer = Values.areEqual) {
        return using(this.getEnumerator(), e1 => using(enumeratorFrom(second), e2 => {
            throwIfEndless(e1.isEndless && e2.isEndless);
            while (e1.moveNext()) {
                if (!e2.moveNext() || !equalityComparer(e1.current, e2.current))
                    return false;
            }
            return !e2.moveNext();
        }));
    }
    ofType(type) {
        return super.ofType(type);
    }
    except(second, compareSelector) {
        return super.except(second, compareSelector);
    }
    distinct(compareSelector) {
        return super.distinct(compareSelector);
    }
    distinctUntilChanged(compareSelector = Functions.Identity) {
        return super.distinctUntilChanged(compareSelector);
    }
    orderBy(keySelector = Functions.Identity) {
        return new OrderedEnumerable(this, keySelector, 1);
    }
    orderUsing(comparison) {
        return new OrderedEnumerable(this, null, 1, null, comparison);
    }
    orderUsingReversed(comparison) {
        return new OrderedEnumerable(this, null, -1, null, comparison);
    }
    orderByDescending(keySelector = Functions.Identity) {
        return new OrderedEnumerable(this, keySelector, -1);
    }
    buffer(size) {
        return super.buffer(size);
    }
    groupBy(keySelector, elementSelector, compareSelector) {
        if (!elementSelector)
            elementSelector = Functions.Identity;
        return new Enumerable(() => this.toLookup(keySelector, elementSelector, compareSelector)
            .getEnumerator());
    }
    partitionBy(keySelector, elementSelector, resultSelector = (key, elements) => new Grouping(key, elements), compareSelector = Functions.Identity) {
        var _ = this;
        if (!elementSelector)
            elementSelector = Functions.Identity;
        return new Enumerable(() => {
            var enumerator;
            var key;
            var compareKey;
            var group;
            var len;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                if (enumerator.moveNext()) {
                    key = keySelector(enumerator.current);
                    compareKey = compareSelector(key);
                    group = [elementSelector(enumerator.current)];
                    len = 1;
                }
                else
                    group = null;
            }, (yielder) => {
                if (!group)
                    return yielder.yieldBreak();
                var hasNext, c;
                while ((hasNext = enumerator.moveNext())) {
                    c = enumerator.current;
                    if (compareKey === compareSelector(keySelector(c)))
                        group[len++] = elementSelector(c);
                    else
                        break;
                }
                var result = resultSelector(key, group);
                if (hasNext) {
                    c = enumerator.current;
                    key = keySelector(c);
                    compareKey = compareSelector(key);
                    group = [elementSelector(c)];
                    len = 1;
                }
                else {
                    group = null;
                }
                return yielder.yieldReturn(result);
            }, () => {
                dispose(enumerator);
                group = null;
            });
        });
    }
    aggregate(func, seed) {
        return this.scan(func, seed).lastOrDefault();
    }
    average(selector = Type.numberOrNaN) {
        var count = 0;
        var sum = this.sum((e, i) => {
            count++;
            return selector(e, i);
        });
        return (isNaN(sum) || !count)
            ? NaN
            : (sum / count);
    }
    max() {
        return this.aggregate(Functions.Greater);
    }
    min() {
        return this.aggregate(Functions.Lesser);
    }
    maxBy(keySelector = Functions.Identity) {
        return this.aggregate((a, b) => (keySelector(a) > keySelector(b)) ? a : b);
    }
    minBy(keySelector = Functions.Identity) {
        return this.aggregate((a, b) => (keySelector(a) < keySelector(b)) ? a : b);
    }
    sum(selector = Type.numberOrNaN) {
        var sum = 0;
        var sumInfinite = 0;
        this.forEach(x => {
            var value = selector(x);
            if (isNaN(value)) {
                sum = NaN;
                return false;
            }
            if (isFinite(value))
                sum += value;
            else
                sumInfinite +=
                    value > 0 ?
                        (+1) :
                        (-1);
        });
        return isNaN(sum) ? NaN : (sumInfinite ? (sumInfinite * Infinity) : sum);
    }
    product(selector = Type.numberOrNaN) {
        var result = 1, exists = false;
        this.forEach((x, i) => {
            exists = true;
            var value = selector(x, i);
            if (isNaN(value)) {
                result = NaN;
                return false;
            }
            if (value == 0) {
                result = 0;
                return false;
            }
            result *= value;
        });
        return (exists && isNaN(result)) ? NaN : result;
    }
    quotient(selector = Type.numberOrNaN) {
        var count = 0;
        var result = NaN;
        this.forEach((x, i) => {
            var value = selector(x, i);
            count++;
            if (count === 1) {
                result = value;
            }
            else {
                if (isNaN(value) || value === 0 || !isFinite(value)) {
                    result = NaN;
                    return false;
                }
                result /= value;
            }
        });
        if (count === 1)
            result = NaN;
        return result;
    }
    last() {
        var _ = this;
        _.throwIfDisposed();
        var value = undefined;
        var found = false;
        _.forEach(x => {
            found = true;
            value = x;
        });
        if (!found)
            throw new Error("last:No element satisfies the condition.");
        return value;
    }
    lastOrDefault(defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        var value = undefined;
        var found = false;
        _.forEach(x => {
            found = true;
            value = x;
        });
        return (!found) ? defaultValue : value;
    }
    share() {
        return super.share();
    }
    catchError(handler) {
        return super.catchError(handler);
    }
    finallyAction(action) {
        return super.finallyAction(action);
    }
    memoize() {
        var _ = this, disposed = !_.throwIfDisposed();
        var cache;
        var enumerator;
        return new Enumerable(() => {
            var index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                if (!enumerator)
                    enumerator = _.getEnumerator();
                if (!cache)
                    cache = [];
                index = 0;
            }, (yielder) => {
                throwIfDisposed(disposed);
                var i = index++;
                if (i >= cache.length) {
                    return (enumerator.moveNext())
                        ? yielder.yieldReturn(cache[i] = enumerator.current)
                        : false;
                }
                return yielder.yieldReturn(cache[i]);
            });
        }, () => {
            disposed = true;
            if (cache)
                cache.length = 0;
            cache = null;
            dispose(enumerator);
            enumerator = null;
        });
    }
}
export class FiniteEnumerable extends Enumerable {
    constructor(enumeratorFactory, finalizer) {
        super(enumeratorFactory, finalizer, false);
    }
}
class ArrayEnumerable extends FiniteEnumerable {
    constructor(source) {
        super(() => {
            _.throwIfDisposed();
            return new ArrayEnumerator(() => {
                _.throwIfDisposed("The underlying ArrayEnumerable was disposed.", "ArrayEnumerator");
                return _._source;
            });
        });
        var _ = this;
        _._disposableObjectName = "ArrayEnumerable";
        _._source = source;
    }
    _onDispose() {
        super._onDispose();
        this._source = null;
    }
    get source() {
        return this._source;
    }
    toArray() {
        var _ = this;
        _.throwIfDisposed();
        return toArray(_._source);
    }
    asEnumerable() {
        return new ArrayEnumerable(this._source);
    }
    forEach(action, max = Infinity) {
        var _ = this;
        _.throwIfDisposed();
        return forEach(_._source, action, max);
    }
    any(predicate) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source.length;
        return len && (!predicate || super.any(predicate));
    }
    count(predicate) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source.length;
        return len && (predicate ? super.count(predicate) : len);
    }
    elementAtOrDefault(index, defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        Integer.assertZeroOrGreater(index, 'index');
        var source = _._source;
        return index < source.length
            ? source[index]
            : defaultValue;
    }
    last() {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source.length;
        return (len)
            ? source[len - 1]
            : super.last();
    }
    lastOrDefault(defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source.length;
        return len
            ? source[len - 1]
            : defaultValue;
    }
    skip(count) {
        var _ = this;
        if (!(count > 0))
            return _;
        return new Enumerable(() => new ArrayEnumerator(() => _._source, count));
    }
    takeExceptLast(count = 1) {
        var _ = this;
        return _.take(_._source.length - count);
    }
    skipToLast(count) {
        if (!(count > 0))
            return Enumerable.empty();
        var _ = this;
        if (!isFinite(count))
            return _;
        var len = _._source
            ? _._source.length
            : 0;
        return _.skip(len - count);
    }
    reverse() {
        var _ = this;
        return new Enumerable(() => new ArrayEnumerator(() => _._source, _._source
            ? (_._source.length - 1)
            : 0, -1));
    }
    memoize() {
        return this.asEnumerable();
    }
    sequenceEqual(second, equalityComparer = Values.areEqual) {
        if (Type.isArrayLike(second))
            return Arrays.areEqual(this.source, second, true, equalityComparer);
        if (second instanceof ArrayEnumerable)
            return second.sequenceEqual(this.source, equalityComparer);
        return super.sequenceEqual(second, equalityComparer);
    }
    toJoinedString(separator = "", selector = Functions.Identity) {
        var s = this._source;
        return !selector && Array.isArray(s)
            ? s.join(separator)
            : super.toJoinedString(separator, selector);
    }
}
class Grouping extends ArrayEnumerable {
    constructor(_groupKey, elements) {
        super(elements);
        this._groupKey = _groupKey;
    }
    get key() {
        return this._groupKey;
    }
}
class Lookup {
    constructor(_dictionary) {
        this._dictionary = _dictionary;
    }
    get count() {
        return this._dictionary.count;
    }
    get(key) {
        return this._dictionary.getValue(key);
    }
    contains(key) {
        return this._dictionary.containsKey(key);
    }
    getEnumerator() {
        var _ = this;
        var enumerator;
        return new EnumeratorBase(() => {
            enumerator = _._dictionary.getEnumerator();
        }, (yielder) => {
            if (!enumerator.moveNext())
                return false;
            var current = enumerator.current;
            return yielder.yieldReturn(new Grouping(current.key, current.value));
        }, () => {
            dispose(enumerator);
        });
    }
}
class OrderedEnumerable extends FiniteEnumerable {
    constructor(source, keySelector, order, parent, comparer = Values.compare) {
        super(null);
        this.source = source;
        this.keySelector = keySelector;
        this.order = order;
        this.parent = parent;
        this.comparer = comparer;
        throwIfEndless(source && source.isEndless);
    }
    createOrderedEnumerable(keySelector, order) {
        return new OrderedEnumerable(this.source, keySelector, order, this);
    }
    thenBy(keySelector) {
        return this.createOrderedEnumerable(keySelector, 1);
    }
    thenUsing(comparison) {
        return new OrderedEnumerable(this.source, null, 1, this, comparison);
    }
    thenByDescending(keySelector) {
        return this.createOrderedEnumerable(keySelector, -1);
    }
    thenUsingReversed(comparison) {
        return new OrderedEnumerable(this.source, null, -1, this, comparison);
    }
    getEnumerator() {
        var _ = this;
        var buffer;
        var indexes;
        var index = 0;
        return new EnumeratorBase(() => {
            index = 0;
            buffer = Enumerable.toArray(_.source);
            indexes = createSortContext(_).generateSortedIndexes(buffer);
        }, (yielder) => {
            return (index < indexes.length)
                ? yielder.yieldReturn(buffer[indexes[index++]])
                : false;
        }, () => {
            if (buffer)
                buffer.length = 0;
            buffer = null;
            if (indexes)
                indexes.length = 0;
            indexes = null;
        }, false);
    }
    _onDispose() {
        super._onDispose();
        this.source = null;
        this.keySelector = null;
        this.order = null;
        this.parent = null;
    }
}
function nextEnumerator(queue, e) {
    if (e) {
        if (e.moveNext()) {
            queue.enqueue(e);
        }
        else {
            dispose(e);
            e = null;
        }
    }
    return e;
}
function createSortContext(orderedEnumerable, currentContext = null) {
    var context = new KeySortedContext(currentContext, orderedEnumerable.keySelector, orderedEnumerable.order, orderedEnumerable.comparer);
    if (orderedEnumerable.parent)
        return createSortContext(orderedEnumerable.parent, context);
    return context;
}
function throwIfDisposed(disposed) {
    if (disposed)
        throw new ObjectDisposedException("Enumerable");
}
export default Enumerable;
//# sourceMappingURL=Linq.js.map