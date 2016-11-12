/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual as areEqualValues, compare as compareValues } from "../System/Compare";
import * as Arrays from "../System/Collections/Array/Compare";
import * as ArrayUtility from "../System/Collections/Array/Utility";
import { copy } from "../System/Collections/Array/Utility";
import * as enumUtil from "../System/Collections/Enumeration/Enumerator";
import { isEnumerable, throwIfEndless } from "../System/Collections/Enumeration/Enumerator";
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
import __extendsImport from "../extends";
import { IndexEnumerator } from "../System/Collections/Enumeration/IndexEnumerator";
const __extends = __extendsImport;
const INVALID_DEFAULT = {};
const VOID0 = void 0;
const NULL = null;
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
        const _ = this;
        _.throwIfDisposed();
        return new InfiniteEnumerable(() => _.getEnumerator());
    }
    doAction(action, initializer, isEndless = this.isEndless) {
        const _ = this;
        const isE = isEndless || undefined;
        var disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            let enumerator;
            let index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                if (initializer)
                    initializer();
                index = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    let actionResult = action(enumerator.current, index++);
                    if (actionResult === false || actionResult === 0)
                        return yielder.yieldBreak();
                    if (actionResult !== 2)
                        return yielder.yieldReturn(enumerator.current);
                }
                return false;
            }, () => {
                dispose(enumerator);
            }, isE);
        }, () => {
            disposed = true;
        }, isE);
    }
    force() {
        this.throwIfDisposed();
        this.doAction(BREAK)
            .getEnumerator()
            .moveNext();
    }
    skip(count) {
        const _ = this;
        _.throwIfDisposed();
        if (!isFinite(count))
            return new InfiniteEnumerable(getEmptyEnumerator);
        Integer.assert(count, "count");
        return this.doAction((element, index) => index < count
            ? 2
            : 1);
    }
    take(count) {
        if (!(count > 0))
            return Enumerable.empty();
        const _ = this;
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
    elementAtOrDefault(index, defaultValue) {
        const _ = this;
        _.throwIfDisposed();
        Integer.assertZeroOrGreater(index, 'index');
        var n = index;
        return using(this.getEnumerator(), e => {
            let i = 0;
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
    firstOrDefault(defaultValue) {
        const _ = this;
        _.throwIfDisposed();
        return using(this.getEnumerator(), e => e.moveNext() ? e.current : defaultValue);
    }
    single() {
        const _ = this;
        _.throwIfDisposed();
        return using(this.getEnumerator(), e => {
            if (e.moveNext()) {
                let value = e.current;
                if (!e.moveNext())
                    return value;
                throw new Error("single:sequence contains more than one element.");
            }
            throw new Error("single:The sequence is empty.");
        });
    }
    singleOrDefault(defaultValue) {
        const _ = this;
        _.throwIfDisposed();
        return using(this.getEnumerator(), e => {
            if (e.moveNext()) {
                let value = e.current;
                if (!e.moveNext())
                    return value;
            }
            return defaultValue;
        });
    }
    any() {
        const _ = this;
        _.throwIfDisposed();
        return using(this.getEnumerator(), e => e.moveNext());
    }
    isEmpty() {
        return !this.any();
    }
    traverseBreadthFirst(childrenSelector, resultSelector = Functions.Identity) {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let enumerator;
            let nestLevel = 0;
            let buffer, len;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
                nestLevel = 0;
                buffer = [];
                len = 0;
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (true) {
                    if (enumerator.moveNext()) {
                        buffer[len++] = enumerator.current;
                        return yielder.yieldReturn(resultSelector(enumerator.current, nestLevel));
                    }
                    if (!len)
                        return yielder.yieldBreak();
                    let next = Enumerable
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
        }, () => {
            disposed = true;
        }, isEndless);
    }
    traverseDepthFirst(childrenSelector, resultSelector = Functions.Identity) {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let enumeratorStack = [];
            let enumerator;
            let len;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
                len = 0;
            }, (yielder) => {
                throwIfDisposed(disposed);
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
        }, () => {
            disposed = true;
        }, isEndless);
    }
    flatten() {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let enumerator;
            let middleEnumerator = null;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
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
                        let c = enumerator.current;
                        let e = !Type.isString(c) && Enumerable.fromAny(c);
                        if (e) {
                            middleEnumerator = e
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
        }, () => {
            disposed = true;
        }, isEndless);
    }
    pairwise(selector) {
        const _ = this;
        _.throwIfDisposed();
        if (!selector)
            throw new ArgumentNullException("selector");
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let enumerator;
            return new EnumeratorBase(() => {
                throwIfDisposed(!selector);
                enumerator = _.getEnumerator();
                enumerator.moveNext();
            }, (yielder) => {
                throwIfDisposed(!selector);
                let prev = enumerator.current;
                return enumerator.moveNext()
                    && yielder.yieldReturn(selector(prev, enumerator.current));
            }, () => {
                dispose(enumerator);
            }, isEndless);
        }, () => {
            selector = NULL;
        }, isEndless);
    }
    scan(func, seed) {
        const _ = this;
        _.throwIfDisposed();
        if (!func)
            throw new ArgumentNullException("func");
        var isUseSeed = seed !== VOID0;
        return new Enumerable(() => {
            let enumerator;
            let value;
            let isFirst;
            return new EnumeratorBase(() => {
                throwIfDisposed(!func);
                enumerator = _.getEnumerator();
                isFirst = true;
            }, (yielder) => {
                throwIfDisposed(!func);
                if (isFirst) {
                    isFirst = false;
                    return isUseSeed
                        ? yielder.yieldReturn(value = seed)
                        : enumerator.moveNext()
                            && yielder.yieldReturn(value = enumerator.current);
                }
                return (enumerator.moveNext())
                    ? yielder.yieldReturn(value = func(value, enumerator.current))
                    : false;
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, () => {
            func = NULL;
        }, _._isEndless);
    }
    select(selector) {
        const _ = this;
        _.throwIfDisposed();
        if (!selector)
            throw new ArgumentNullException("selector");
        return new Enumerable(() => {
            let enumerator;
            let index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(!selector);
                index = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(!selector);
                return enumerator.moveNext()
                    ? yielder.yieldReturn(selector(enumerator.current, index++))
                    : yielder.yieldBreak();
            }, () => {
                dispose(enumerator);
            }, _._isEndless);
        }, () => {
            selector = NULL;
        }, _._isEndless);
    }
    _selectMany(collectionSelector, resultSelector) {
        const _ = this;
        _.throwIfDisposed();
        if (!collectionSelector)
            throw new ArgumentNullException("collectionSelector");
        const isEndless = _._isEndless;
        if (!resultSelector)
            resultSelector = (a, b) => b;
        return new Enumerable(() => {
            let enumerator;
            let middleEnumerator;
            let index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(!collectionSelector);
                enumerator = _.getEnumerator();
                middleEnumerator = VOID0;
                index = 0;
            }, (yielder) => {
                throwIfDisposed(!collectionSelector);
                if (middleEnumerator === VOID0 && !enumerator.moveNext())
                    return false;
                do {
                    if (!middleEnumerator) {
                        let middleSeq = collectionSelector(enumerator.current, index++);
                        if (!middleSeq)
                            continue;
                        middleEnumerator = enumUtil.from(middleSeq);
                    }
                    if (middleEnumerator.moveNext())
                        return yielder.yieldReturn(resultSelector(enumerator.current, middleEnumerator.current));
                    middleEnumerator.dispose();
                    middleEnumerator = null;
                } while (enumerator.moveNext());
                return false;
            }, () => {
                dispose(enumerator, middleEnumerator);
                enumerator = NULL;
                middleEnumerator = null;
            }, isEndless);
        }, () => {
            collectionSelector = NULL;
        }, isEndless);
    }
    selectMany(collectionSelector, resultSelector) {
        return this._selectMany(collectionSelector, resultSelector);
    }
    _choose(selector) {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let enumerator;
            let index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                index = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    let result = selector(enumerator.current, index++);
                    if (result !== null && result !== VOID0)
                        return yielder.yieldReturn(result);
                }
                return false;
            }, () => {
                dispose(enumerator);
            }, isEndless);
        }, () => {
            disposed = true;
        }, isEndless);
    }
    choose(selector = Functions.Identity) {
        return this._choose(selector);
    }
    where(predicate) {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            let enumerator;
            let index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                index = 0;
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    let v = enumerator.current;
                    if (predicate(v, index++))
                        return yielder.yieldReturn(v);
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
        const _ = this;
        var disposed = !_.throwIfDisposed();
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let enumerator;
            let keys;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
                keys = new Dictionary(compareSelector);
                if (second)
                    enumUtil.forEach(second, key => { keys.addByKeyValue(key, true); });
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    let current = enumerator.current;
                    if (!keys.containsKey(current)) {
                        keys.addByKeyValue(current, true);
                        return yielder.yieldReturn(current);
                    }
                }
                return false;
            }, () => {
                dispose(enumerator);
                keys.clear();
            }, isEndless);
        }, () => {
            disposed = true;
        }, isEndless);
    }
    distinct(compareSelector) {
        return this.except(NULL, compareSelector);
    }
    distinctUntilChanged(compareSelector = Functions.Identity) {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let enumerator;
            let compareKey;
            let initial = true;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                enumerator = _.getEnumerator();
            }, (yielder) => {
                throwIfDisposed(disposed);
                while (enumerator.moveNext()) {
                    let key = compareSelector(enumerator.current);
                    if (initial) {
                        initial = false;
                    }
                    else if (areEqualValues(compareKey, key)) {
                        continue;
                    }
                    compareKey = key;
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
    defaultIfEmpty(defaultValue) {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let enumerator;
            let isFirst;
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
            }, isEndless);
        }, null, isEndless);
    }
    zip(second, resultSelector) {
        const _ = this;
        _.throwIfDisposed();
        return new Enumerable(() => {
            let firstEnumerator;
            let secondEnumerator;
            let index = 0;
            return new EnumeratorBase(() => {
                index = 0;
                firstEnumerator = _.getEnumerator();
                secondEnumerator = enumUtil.from(second);
            }, (yielder) => firstEnumerator.moveNext()
                && secondEnumerator.moveNext()
                && yielder.yieldReturn(resultSelector(firstEnumerator.current, secondEnumerator.current, index++)), () => {
                dispose(firstEnumerator, secondEnumerator);
            });
        });
    }
    zipMultiple(second, resultSelector) {
        const _ = this;
        _.throwIfDisposed();
        if (!second.length)
            return Enumerable.empty();
        return new Enumerable(() => {
            let secondTemp;
            let firstEnumerator;
            let secondEnumerator;
            let index = 0;
            return new EnumeratorBase(() => {
                secondTemp = new Queue(second);
                index = 0;
                firstEnumerator = _.getEnumerator();
                secondEnumerator = NULL;
            }, (yielder) => {
                if (firstEnumerator.moveNext()) {
                    while (true) {
                        while (!secondEnumerator) {
                            if (secondTemp.count) {
                                let next = secondTemp.dequeue();
                                if (next)
                                    secondEnumerator = enumUtil.from(next);
                            }
                            else
                                return yielder.yieldBreak();
                        }
                        if (secondEnumerator.moveNext())
                            return yielder.yieldReturn(resultSelector(firstEnumerator.current, secondEnumerator.current, index++));
                        secondEnumerator.dispose();
                        secondEnumerator = NULL;
                    }
                }
                return yielder.yieldBreak();
            }, () => {
                dispose(firstEnumerator, secondTemp);
            });
        });
    }
    join(inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector = Functions.Identity) {
        const _ = this;
        return new Enumerable(() => {
            let outerEnumerator;
            let lookup;
            let innerElements;
            let innerCount = 0;
            return new EnumeratorBase(() => {
                outerEnumerator = _.getEnumerator();
                lookup = Enumerable.from(inner)
                    .toLookup(innerKeySelector, Functions.Identity, compareSelector);
            }, (yielder) => {
                while (true) {
                    if (innerElements) {
                        let innerElement = innerElements[innerCount++];
                        if (innerElement !== VOID0)
                            return yielder.yieldReturn(resultSelector(outerEnumerator.current, innerElement));
                        innerElements = null;
                        innerCount = 0;
                    }
                    if (outerEnumerator.moveNext()) {
                        let key = outerKeySelector(outerEnumerator.current);
                        innerElements = lookup.get(key);
                    }
                    else {
                        return yielder.yieldBreak();
                    }
                }
            }, () => {
                dispose(outerEnumerator);
                innerElements = null;
                outerEnumerator = NULL;
                lookup = NULL;
            });
        });
    }
    groupJoin(inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector = Functions.Identity) {
        const _ = this;
        return new Enumerable(() => {
            let enumerator;
            let lookup;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                lookup = Enumerable.from(inner)
                    .toLookup(innerKeySelector, Functions.Identity, compareSelector);
            }, (yielder) => enumerator.moveNext()
                && yielder.yieldReturn(resultSelector(enumerator.current, lookup.get(outerKeySelector(enumerator.current)))), () => {
                dispose(enumerator);
                enumerator = NULL;
                lookup = NULL;
            });
        });
    }
    merge(enumerables) {
        const _ = this;
        const isEndless = _._isEndless;
        if (!enumerables || enumerables.length == 0)
            return _;
        return new Enumerable(() => {
            let enumerator;
            let queue;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
                queue = new Queue(enumerables);
            }, (yielder) => {
                while (true) {
                    while (!enumerator && queue.count) {
                        enumerator = enumUtil.from(queue.dequeue());
                    }
                    if (enumerator && enumerator.moveNext())
                        return yielder.yieldReturn(enumerator.current);
                    if (enumerator) {
                        enumerator.dispose();
                        enumerator = NULL;
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
        const _ = this;
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let firstEnumerator;
            let secondEnumerator;
            let keys;
            return new EnumeratorBase(() => {
                firstEnumerator = _.getEnumerator();
                keys = new Dictionary(compareSelector);
            }, (yielder) => {
                let current;
                if (secondEnumerator === VOID0) {
                    while (firstEnumerator.moveNext()) {
                        current = firstEnumerator.current;
                        if (!keys.containsKey(current)) {
                            keys.addByKeyValue(current, null);
                            return yielder.yieldReturn(current);
                        }
                    }
                    secondEnumerator = enumUtil.from(second);
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
        const _ = this;
        _.throwIfDisposed();
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let firstEnumerator;
            let secondEnumerator;
            let count = 0;
            let isEnumerated = false;
            return new EnumeratorBase(() => {
                count = 0;
                firstEnumerator = _.getEnumerator();
                secondEnumerator = enumUtil.from(other);
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
        const _ = this;
        const isEndless = _._isEndless;
        return new Enumerable(() => {
            let buffer, mode, enumerator, alternateEnumerator;
            return new EnumeratorBase(() => {
                alternateEnumerator = new ArrayEnumerator(Enumerable.toArray(sequence));
                enumerator = _.getEnumerator();
                let hasAtLeastOne = enumerator.moveNext();
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
                let latest = buffer;
                let another = enumerator.moveNext();
                mode = another
                    ? 2
                    : 0;
                if (another)
                    buffer = enumerator.current;
                return yielder.yieldReturn(latest);
            }, () => {
                dispose(enumerator, alternateEnumerator);
            }, isEndless);
        }, null, isEndless);
    }
    alternateSingle(value) {
        return this.alternateMultiple(Enumerable.make(value));
    }
    alternate(...sequence) {
        return this.alternateMultiple(sequence);
    }
    catchError(handler) {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            let enumerator;
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
        const _ = this;
        var disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            let enumerator;
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
        const _ = this;
        const isEndless = _._isEndless;
        var len;
        return new Enumerable(() => {
            let enumerator;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
            }, (yielder) => {
                let array = ArrayUtility.initialize(size);
                len = 0;
                while (len < size && enumerator.moveNext()) {
                    array[len++] = enumerator.current;
                }
                array.length = len;
                return !!len && yielder.yieldReturn(array);
            }, () => {
                dispose(enumerator);
            }, isEndless);
        }, null, isEndless);
    }
    share() {
        const _ = this;
        _.throwIfDisposed();
        let sharedEnumerator;
        return new Enumerable(() => {
            return sharedEnumerator || (sharedEnumerator = _.getEnumerator());
        }, () => {
            dispose(sharedEnumerator);
        }, _._isEndless);
    }
}
export class Enumerable extends InfiniteEnumerable {
    constructor(enumeratorFactory, finalizer, isEndless) {
        super(enumeratorFactory, finalizer);
        this._isEndless = isEndless;
    }
    asEnumerable() {
        const _ = this;
        _.throwIfDisposed();
        return new Enumerable(() => _.getEnumerator());
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
        let found = false;
        return this.doAction((element, index) => {
            if (found)
                return 0;
            found = predicate(element, index);
            return 1;
        }, () => {
            found = false;
        }, null);
    }
    forEach(action, max = Infinity) {
        const _ = this;
        _.throwIfDisposed();
        throwIfEndless(_.isEndless);
        var index = 0;
        return max > 0 ? using(_.getEnumerator(), e => {
            throwIfEndless(!isFinite(max) && !!e.isEndless);
            let i = 0;
            while (max > i && _.throwIfDisposed() && e.moveNext()) {
                if (action(e.current, i++) === false)
                    break;
            }
            return i;
        }) : 0;
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
        enumUtil.forEach(this, (x, i) => {
            target[i + index] = x;
        }, count);
        return target;
    }
    toLookup(keySelector, elementSelector = Functions.Identity, compareSelector = Functions.Identity) {
        var dict = new Dictionary(compareSelector);
        this.forEach((x, i) => {
            let key = keySelector(x, i);
            let element = elementSelector(x, i);
            let array = dict.getValue(key);
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
        return this
            .select(selector)
            .toArray()
            .join(separator);
    }
    takeExceptLast(count = 1) {
        const _ = this;
        if (!(count > 0))
            return _;
        if (!isFinite(count))
            return Enumerable.empty();
        Integer.assert(count, "count");
        var c = count;
        return new Enumerable(() => {
            let enumerator;
            let q;
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
        const _ = this;
        if (!isFinite(count))
            return _;
        Integer.assert(count, "count");
        return _.reverse()
            .take(count)
            .reverse();
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
        const _ = this;
        var disposed = !_.throwIfDisposed();
        throwIfEndless(_._isEndless);
        return new Enumerable(() => {
            let buffer;
            let index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                _.throwIfDisposed();
                buffer = _.toArray();
                index = buffer.length;
            }, (yielder) => !!index && yielder.yieldReturn(buffer[--index]), () => {
                buffer.length = 0;
            });
        }, () => {
            disposed = true;
        });
    }
    shuffle() {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        throwIfEndless(_._isEndless);
        return new Enumerable(() => {
            let buffer;
            let capacity;
            let len;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                buffer = _.toArray();
                capacity = len = buffer.length;
            }, (yielder) => {
                if (!len)
                    return yielder.yieldBreak();
                let selectedIndex = Integer.random(len);
                let selectedValue = buffer[selectedIndex];
                buffer[selectedIndex] = buffer[--len];
                buffer[len] = NULL;
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
        if (compareSelector) {
            var s = compareSelector(value);
            return this.any(v => areEqualValues(compareSelector(v), s));
        }
        return this.any(v => areEqualValues(v, value));
    }
    indexOf(value, compareSelector) {
        var found = -1;
        this.forEach(compareSelector
            ?
                    (element, i) => {
                    if (areEqualValues(compareSelector(element, i), compareSelector(value, i), true)) {
                        found = i;
                        return false;
                    }
                }
            :
                    (element, i) => {
                    if (areEqualValues(element, value, true)) {
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
                    if (areEqualValues(compareSelector(element, i), compareSelector(value, i), true))
                        result
                            = i;
                }
            :
                    (element, i) => {
                    if (areEqualValues(element, value, true))
                        result = i;
                });
        return result;
    }
    intersect(second, compareSelector) {
        const _ = this;
        _.throwIfDisposed();
        if (!second)
            throw new ArgumentNullException("second");
        const isEndless = _.isEndless;
        return new Enumerable(() => {
            let enumerator;
            let keys;
            let outs;
            return new EnumeratorBase(() => {
                throwIfDisposed(!second);
                enumerator = _.getEnumerator();
                keys = new Dictionary(compareSelector);
                outs = new Dictionary(compareSelector);
                enumUtil.forEach(second, key => {
                    keys.addByKeyValue(key, true);
                });
            }, (yielder) => {
                while (enumerator.moveNext()) {
                    let current = enumerator.current;
                    if (!outs.containsKey(current) && keys.containsKey(current)) {
                        outs.addByKeyValue(current, true);
                        return yielder.yieldReturn(current);
                    }
                }
                return yielder.yieldBreak();
            }, () => {
                dispose(enumerator, keys, outs);
            }, isEndless);
        }, () => {
            second = NULL;
        }, isEndless);
    }
    sequenceEqual(second, equalityComparer = areEqualValues) {
        this.throwIfDisposed();
        return using(this.getEnumerator(), e1 => using(enumUtil.from(second), e2 => {
            throwIfEndless(e1.isEndless && e2.isEndless);
            while (e1.moveNext()) {
                if (!e2.moveNext() || !equalityComparer(e1.current, e2.current))
                    return false;
            }
            return !e2.moveNext();
        }));
    }
    ofType(type) {
        this.throwIfDisposed();
        return super.ofType(type);
    }
    orderBy(keySelector = Functions.Identity) {
        this.throwIfDisposed();
        return new OrderedEnumerable(this, keySelector, 1);
    }
    orderUsing(comparison) {
        this.throwIfDisposed();
        return new OrderedEnumerable(this, null, 1, null, comparison);
    }
    orderUsingReversed(comparison) {
        this.throwIfDisposed();
        return new OrderedEnumerable(this, null, -1, null, comparison);
    }
    orderByDescending(keySelector = Functions.Identity) {
        this.throwIfDisposed();
        return new OrderedEnumerable(this, keySelector, -1);
    }
    buffer(size) {
        return super.buffer(size);
    }
    groupBy(keySelector, elementSelector, compareSelector) {
        if (!elementSelector)
            elementSelector = Functions.Identity;
        return new Enumerable(() => this
            .toLookup(keySelector, elementSelector, compareSelector)
            .getEnumerator());
    }
    partitionBy(keySelector, elementSelector, resultSelector = (key, elements) => new Grouping(key, elements), compareSelector = Functions.Identity) {
        const _ = this;
        if (!elementSelector)
            elementSelector = Functions.Identity;
        return new Enumerable(() => {
            let enumerator;
            let key;
            let compareKey;
            let group;
            let len;
            return new EnumeratorBase(() => {
                throwIfDisposed(!elementSelector);
                enumerator = _.getEnumerator();
                if (enumerator.moveNext()) {
                    let v = enumerator.current;
                    key = keySelector(v);
                    compareKey = compareSelector(key);
                    group = [elementSelector(v)];
                    len = 1;
                }
                else
                    group = null;
            }, (yielder) => {
                throwIfDisposed(!elementSelector);
                if (!group)
                    return yielder.yieldBreak();
                let hasNext, c;
                while ((hasNext = enumerator.moveNext())) {
                    c = enumerator.current;
                    if (areEqualValues(compareKey, compareSelector(keySelector(c))))
                        group[len++] = elementSelector(c);
                    else
                        break;
                }
                let result = resultSelector(key, group);
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
        }, () => {
            elementSelector = NULL;
        });
    }
    aggregate(func, seed) {
        return this
            .scan(func, seed)
            .lastOrDefault();
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
        this.forEach((x, i) => {
            let value = selector(x, i);
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
            let value = selector(x, i);
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
            let value = selector(x, i);
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
        const _ = this;
        _.throwIfDisposed();
        var value = VOID0;
        var found = false;
        _.forEach(x => {
            found = true;
            value = x;
        });
        if (!found)
            throw new Error("last:No element satisfies the condition.");
        return value;
    }
    lastOrDefault(defaultValue) {
        const _ = this;
        _.throwIfDisposed();
        var value = VOID0;
        var found = false;
        _.forEach(x => {
            found = true;
            value = x;
        });
        return (!found) ? defaultValue : value;
    }
    memoize() {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        var cache;
        var enumerator;
        return new Enumerable(() => {
            let index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                if (!enumerator)
                    enumerator = _.getEnumerator();
                if (!cache)
                    cache = [];
                index = 0;
            }, (yielder) => {
                throwIfDisposed(disposed);
                let i = index++;
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
            cache = NULL;
            dispose(enumerator);
            enumerator = NULL;
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
        const _ = this;
        _._disposableObjectName = "ArrayEnumerable";
        _._source = source;
    }
    _onDispose() {
        super._onDispose();
        this._source = NULL;
    }
    get source() {
        return this._source;
    }
    toArray() {
        const _ = this;
        _.throwIfDisposed();
        return enumUtil.toArray(_._source);
    }
    asEnumerable() {
        const _ = this;
        _.throwIfDisposed();
        return new ArrayEnumerable(this._source);
    }
    forEach(action, max = Infinity) {
        const _ = this;
        _.throwIfDisposed();
        return enumUtil.forEach(_._source, action, max);
    }
    any(predicate) {
        const _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source.length;
        return !!len && (!predicate || super.any(predicate));
    }
    count(predicate) {
        const _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source.length;
        return len && (predicate ? super.count(predicate) : len);
    }
    elementAtOrDefault(index, defaultValue) {
        const _ = this;
        _.throwIfDisposed();
        Integer.assertZeroOrGreater(index, 'index');
        var source = _._source;
        return index < source.length
            ? source[index]
            : defaultValue;
    }
    last() {
        const _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source.length;
        return (len)
            ? source[len - 1]
            : super.last();
    }
    lastOrDefault(defaultValue) {
        const _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source.length;
        return len
            ? source[len - 1]
            : defaultValue;
    }
    skip(count) {
        const _ = this;
        _.throwIfDisposed();
        if (!(count > 0))
            return _;
        return new Enumerable(() => new ArrayEnumerator(() => _._source, count));
    }
    takeExceptLast(count = 1) {
        const _ = this;
        _.throwIfDisposed();
        return _.take(_._source.length - count);
    }
    skipToLast(count) {
        const _ = this;
        _.throwIfDisposed();
        if (!(count > 0))
            return Enumerable.empty();
        if (!isFinite(count))
            return _;
        var len = _._source
            ? _._source.length
            : 0;
        return _.skip(len - count);
    }
    reverse() {
        const _ = this;
        var disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            _.throwIfDisposed();
            return new IndexEnumerator(() => {
                var s = _._source;
                throwIfDisposed(disposed || !s);
                return {
                    source: s,
                    pointer: (s.length - 1),
                    length: s.length,
                    step: -1
                };
            });
        }, () => {
            disposed = true;
        });
    }
    memoize() {
        return this.asEnumerable();
    }
    sequenceEqual(second, equalityComparer = areEqualValues) {
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
        return this._dictionary.getValue(key) || null;
    }
    contains(key) {
        return this._dictionary.containsKey(key);
    }
    getEnumerator() {
        const _ = this;
        var enumerator;
        return new EnumeratorBase(() => {
            enumerator = _._dictionary.getEnumerator();
        }, (yielder) => {
            if (!enumerator.moveNext())
                return false;
            let current = enumerator.current;
            return yielder.yieldReturn(new Grouping(current.key, current.value));
        }, () => {
            dispose(enumerator);
            enumerator = NULL;
        });
    }
}
class OrderedEnumerable extends FiniteEnumerable {
    constructor(source, keySelector, order, parent, comparer = compareValues) {
        super(NULL);
        this.source = source;
        this.keySelector = keySelector;
        this.order = order;
        this.parent = parent;
        this.comparer = comparer;
        throwIfEndless(!!source && !!source.isEndless);
    }
    createOrderedEnumerable(keySelector, order) {
        this.throwIfDisposed();
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
        const _ = this;
        _.throwIfDisposed();
        var buffer;
        var indexes;
        var index = 0;
        return new EnumeratorBase(() => {
            _.throwIfDisposed();
            index = 0;
            buffer = Enumerable.toArray(_.source);
            indexes = createSortContext(_)
                .generateSortedIndexes(buffer);
        }, (yielder) => {
            _.throwIfDisposed();
            return (index < indexes.length)
                ? yielder.yieldReturn(buffer[indexes[index++]])
                : false;
        }, () => {
            if (buffer)
                buffer.length = 0;
            buffer = NULL;
            if (indexes)
                indexes.length = 0;
            indexes = NULL;
        }, false);
    }
    _onDispose() {
        const _ = this;
        super._onDispose();
        _.source = NULL;
        _.keySelector = NULL;
        _.order = NULL;
        _.parent = NULL;
    }
}
function nextEnumerator(queue, e) {
    if (e) {
        if (e.moveNext()) {
            queue.enqueue(e);
        }
        else {
            dispose(e);
            return null;
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
(function (Enumerable) {
    function from(source) {
        var e = fromAny(source);
        if (!e)
            throw new UnsupportedEnumerableException();
        return e;
    }
    Enumerable.from = from;
    function fromAny(source, defaultEnumerable) {
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
    Enumerable.fromAny = fromAny;
    function fromOrEmpty(source) {
        return Enumerable.fromAny(source) || Enumerable.empty();
    }
    Enumerable.fromOrEmpty = fromOrEmpty;
    function toArray(source) {
        if (source instanceof Enumerable)
            return source.toArray();
        return enumUtil.toArray(source);
    }
    Enumerable.toArray = toArray;
    function _choice(values) {
        return new InfiniteEnumerable(() => new EnumeratorBase(null, (yielder) => {
            throwIfDisposed(!values);
            return yielder.yieldReturn(Integer.random.select(values));
        }, true), () => {
            values.length = 0;
            values = NULL;
        });
    }
    Enumerable._choice = _choice;
    function choice(values) {
        var len = values && values.length;
        if (!len || !isFinite(len))
            throw new ArgumentOutOfRangeException('length', length);
        return _choice(copy(values));
    }
    Enumerable.choice = choice;
    function chooseFrom(...args) {
        if (!args.length)
            throw new ArgumentOutOfRangeException('length', length);
        return _choice(args);
    }
    Enumerable.chooseFrom = chooseFrom;
    function _cycle(values) {
        return new InfiniteEnumerable(() => {
            let index = 0;
            return new EnumeratorBase(() => {
                index = 0;
            }, (yielder) => {
                throwIfDisposed(!values);
                if (index >= values.length)
                    index = 0;
                return yielder.yieldReturn(values[index++]);
            }, true);
        }, () => {
            values.length = 0;
            values = NULL;
        });
    }
    function cycle(values) {
        var len = values && values.length;
        if (!len || !isFinite(len))
            throw new ArgumentOutOfRangeException('length', length);
        return _cycle(copy(values));
    }
    Enumerable.cycle = cycle;
    function cycleThrough(...args) {
        if (!args.length)
            throw new ArgumentOutOfRangeException('length', length);
        return _cycle(args);
    }
    Enumerable.cycleThrough = cycleThrough;
    function empty() {
        return new FiniteEnumerable(getEmptyEnumerator);
    }
    Enumerable.empty = empty;
    function repeat(element, count = Infinity) {
        if (!(count > 0))
            return Enumerable.empty();
        return isFinite(count) && Integer.assert(count, "count")
            ? new FiniteEnumerable(() => {
                let c = count;
                let index = 0;
                return new EnumeratorBase(() => { index = 0; }, (yielder) => (index++ < c) && yielder.yieldReturn(element), null, false);
            })
            : new Enumerable(() => new EnumeratorBase(null, (yielder) => yielder.yieldReturn(element), true));
    }
    Enumerable.repeat = repeat;
    function repeatWithFinalize(initializer, finalizer) {
        if (!initializer)
            throw new ArgumentNullException("initializer");
        return new InfiniteEnumerable(() => {
            let element;
            return new EnumeratorBase(() => {
                if (initializer)
                    element = initializer();
            }, (yielder) => {
                return initializer
                    ? yielder.yieldReturn(element)
                    : yielder.yieldBreak();
            }, () => {
                element = NULL;
                if (finalizer)
                    finalizer(element);
            }, true);
        }, () => {
            initializer = NULL;
            finalizer = VOID0;
        });
    }
    Enumerable.repeatWithFinalize = repeatWithFinalize;
    function make(element) {
        return repeat(element, 1);
    }
    Enumerable.make = make;
    function range(start, count, step = 1) {
        if (!isFinite(start))
            throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");
        if (!(count > 0))
            return empty();
        if (!step)
            throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");
        if (!isFinite(step))
            throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");
        Integer.assert(count, "count");
        return new FiniteEnumerable(() => {
            let value;
            let c = count;
            let index = 0;
            return new EnumeratorBase(() => {
                index = 0;
                value = start;
            }, (yielder) => {
                let result = index++ < c
                    && yielder.yieldReturn(value);
                if (result && index < count)
                    value += step;
                return result;
            }, false);
        });
    }
    Enumerable.range = range;
    function rangeDown(start, count, step = 1) {
        step = Math.abs(step) * -1;
        return range(start, count, step);
    }
    Enumerable.rangeDown = rangeDown;
    function toInfinity(start = 0, step = 1) {
        if (!isFinite(start))
            throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");
        if (!step)
            throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");
        if (!isFinite(step))
            throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");
        return new InfiniteEnumerable(() => {
            let value;
            return new EnumeratorBase(() => {
                value = start;
            }, (yielder) => {
                let current = value;
                value += step;
                return yielder.yieldReturn(current);
            }, true);
        });
    }
    Enumerable.toInfinity = toInfinity;
    function toNegativeInfinity(start = 0, step = 1) {
        return toInfinity(start, -step);
    }
    Enumerable.toNegativeInfinity = toNegativeInfinity;
    function rangeTo(start, to, step = 1) {
        if (isNaN(to) || !isFinite(to))
            throw new ArgumentOutOfRangeException("to", to, "Must be a finite number.");
        if (step && !isFinite(step))
            throw new ArgumentOutOfRangeException("step", step, "Must be a finite non-zero number.");
        step = Math.abs(step);
        return new FiniteEnumerable(() => {
            let value;
            return new EnumeratorBase(() => { value = start; }, start < to
                ?
                    yielder => {
                        let result = value <= to && yielder.yieldReturn(value);
                        if (result)
                            value += step;
                        return result;
                    }
                :
                    yielder => {
                        let result = value >= to && yielder.yieldReturn(value);
                        if (result)
                            value -= step;
                        return result;
                    }, false);
        });
    }
    Enumerable.rangeTo = rangeTo;
    function matches(input, pattern, flags = "") {
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
            let regex;
            return new EnumeratorBase(() => {
                regex = new RegExp(pattern, flags);
            }, (yielder) => {
                let match = regex.exec(input);
                return (match !== null) ? yielder.yieldReturn(match) : false;
            });
        });
    }
    Enumerable.matches = matches;
    function generate(factory, count = Infinity) {
        if (!factory)
            throw new ArgumentNullException("factory");
        if (isNaN(count) || count <= 0)
            return Enumerable.empty();
        return isFinite(count) && Integer.assert(count, "count")
            ?
                new FiniteEnumerable(() => {
                    let c = count;
                    let index = 0;
                    return new EnumeratorBase(() => {
                        index = 0;
                    }, (yielder) => {
                        throwIfDisposed(!factory);
                        let current = index++;
                        return current < c && yielder.yieldReturn(factory(current));
                    }, false);
                }, () => {
                    factory = NULL;
                })
            :
                new InfiniteEnumerable(() => {
                    let index = 0;
                    return new EnumeratorBase(() => {
                        index = 0;
                    }, (yielder) => {
                        throwIfDisposed(!factory);
                        return yielder.yieldReturn(factory(index++));
                    }, true);
                }, () => {
                    factory = NULL;
                });
    }
    Enumerable.generate = generate;
    function unfold(seed, valueFactory, skipSeed = false) {
        if (!valueFactory)
            throw new ArgumentNullException("factory");
        return new InfiniteEnumerable(() => {
            let index = 0;
            let value;
            let isFirst;
            return new EnumeratorBase(() => {
                index = 0;
                value = seed;
                isFirst = !skipSeed;
            }, (yielder) => {
                throwIfDisposed(!valueFactory);
                let i = index++;
                if (isFirst)
                    isFirst = false;
                else
                    value = valueFactory(value, i);
                return yielder.yieldReturn(value);
            }, true);
        }, () => {
            valueFactory = NULL;
        });
    }
    Enumerable.unfold = unfold;
    function forEach(enumerable, action, max = Infinity) {
        return enumUtil.forEach(enumerable, action, max);
    }
    Enumerable.forEach = forEach;
    function map(enumerable, selector) {
        return enumUtil.map(enumerable, selector);
    }
    Enumerable.map = map;
    function max(values) {
        var v = values
            .takeUntil(v => v == +Infinity, true)
            .aggregate(Functions.Greater);
        return v === VOID0 ? NaN : v;
    }
    Enumerable.max = max;
    function min(values) {
        var v = values
            .takeUntil(v => v == -Infinity, true)
            .aggregate(Functions.Lesser);
        return v === VOID0 ? NaN : v;
    }
    Enumerable.min = min;
    function weave(enumerables) {
        if (!enumerables)
            throw new ArgumentNullException('enumerables');
        var disposed = false;
        return new Enumerable(() => {
            let queue;
            let mainEnumerator;
            let index;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                index = 0;
                queue = new Queue();
                mainEnumerator = enumUtil.from(enumerables);
            }, (yielder) => {
                throwIfDisposed(disposed);
                let e = null;
                if (mainEnumerator) {
                    while (!e && mainEnumerator.moveNext()) {
                        let c = mainEnumerator.current;
                        e = nextEnumerator(queue, c ? enumUtil.from(c) : NULL);
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
                queue = NULL;
            });
        }, () => {
            disposed = true;
        });
    }
    Enumerable.weave = weave;
})(Enumerable || (Enumerable = {}));
export default Enumerable;
//# sourceMappingURL=Linq.js.map