/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import * as Values from '../System/Compare';
import * as Arrays from '../System/Collections/Array/Compare';
import * as ArrayUtility from '../System/Collections/Array/Utility';
import { from as enumeratorFrom, forEach as enumeratorForEach, isEnumerable } from '../System/Collections/Enumeration/Enumerator';
import Type from '../System/Types';
import Integer from '../System/Integer';
import BaseFunctions from '../System/Functions';
import ArrayEnumerator from '../System/Collections/Enumeration/ArrayEnumerator';
import EnumeratorBase from '../System/Collections/Enumeration/EnumeratorBase';
import Dictionary from '../System/Collections/Dictionaries/Dictionary';
import Queue from '../System/Collections/Queue';
import { dispose, disposeThese, using } from '../System/Disposable/Utility';
import DisposableBase from '../System/Disposable/DisposableBase';
import Exception from "../System/Exception";
import ObjectDisposedException from '../System/Disposable/ObjectDisposedException';
import KeySortedContext from "../System/Collections/Sorting/KeySortedContext";
const VOID0 = void 0;
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
class UnsupportedEnumerableException extends Exception {
    constructor() {
        super("Unsupported enumerable.");
    }
}
export class Enumerable extends DisposableBase {
    constructor(_enumeratorFactory, finalizer) {
        super(finalizer);
        this._enumeratorFactory = _enumeratorFactory;
    }
    static fromArray(array) {
        return new ArrayEnumerable(array);
    }
    static from(source) {
        if (Type.isObject(source)) {
            if (source instanceof Enumerable)
                return source;
            if (Array.isArray(source))
                return new ArrayEnumerable(source);
            if (isEnumerable(source))
                return new Enumerable(() => source.getEnumerator());
            if (Type.isArrayLike(source))
                return new ArrayEnumerable(source);
        }
        throw new UnsupportedEnumerableException();
    }
    static toArray(source) {
        if (Type.isObject(source)) {
            if (Array.isArray(source))
                return source.slice();
            if (Type.isArrayLike(source))
                source = new ArrayEnumerable(source);
            if (source instanceof Enumerable)
                return source.toArray();
            if (isEnumerable(source)) {
                var result = [];
                enumeratorForEach(source.getEnumerator(), (e, i) => {
                    result[i] = e;
                });
                return result;
            }
        }
        throw new UnsupportedEnumerableException();
    }
    getEnumerator() {
        this.throwIfDisposed();
        return this._enumeratorFactory();
    }
    _onDispose() {
        super._onDispose();
        this._enumeratorFactory = null;
    }
    static choice(values) {
        return new Enumerable(() => new EnumeratorBase(null, (yielder) => yielder.yieldReturn(values[Integer.random(values.length)])));
    }
    static cycle(values) {
        return new Enumerable(() => {
            var index = 0;
            return new EnumeratorBase(() => {
                index = 0;
            }, (yielder) => {
                if (index >= values.length)
                    index = 0;
                return yielder.yieldReturn(values[index++]);
            });
        });
    }
    static empty() {
        return new Enumerable(() => new EnumeratorBase(null, Functions.False));
    }
    static repeat(element, count = Infinity) {
        if (isNaN(count) || count <= 0)
            return Enumerable.empty();
        return isFinite(count) && Integer.assert(count, "count")
            ? new Enumerable(() => {
                var c = count;
                var index = 0;
                return new EnumeratorBase(() => {
                    index = 0;
                }, (yielder) => (index++ < c) && yielder.yieldReturn(element));
            })
            : new Enumerable(() => new EnumeratorBase(null, (yielder) => yielder.yieldReturn(element)));
    }
    static repeatWithFinalize(initializer, finalizer) {
        return new Enumerable(() => {
            var element;
            return new EnumeratorBase(() => {
                element = initializer();
            }, (yielder) => yielder.yieldReturn(element), () => {
                finalizer(element);
            });
        });
    }
    static make(element) {
        return Enumerable.repeat(element, 1);
    }
    static range(start = 0, count = Infinity, step = 1) {
        if (!isFinite(start))
            throw new Error("Must have a valid 'start' value.");
        if (isNaN(count) || count <= 0)
            return Enumerable.empty();
        if (!isFinite(step))
            throw new Error("Must have a valid 'step' value.");
        return isFinite(count) && Integer.assert(count, "count")
            ? new Enumerable(() => {
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
                });
            })
            : new Enumerable(() => {
                var value;
                return new EnumeratorBase(() => {
                    value = start;
                }, (yielder) => {
                    var current = value;
                    value += step;
                    return yielder.yieldReturn(current);
                });
            });
    }
    static rangeDown(start = 0, count = Infinity, step = 1) {
        step = Math.abs(step) * -1;
        return Enumerable.range(start, count, step);
    }
    static toInfinity(start = 0, step = 1) {
        return Enumerable.range(start, Infinity, step);
    }
    static toNegativeInfinity(start = 0, step = 1) {
        return Enumerable.rangeDown(start, Infinity, step);
    }
    static rangeTo(start = 0, to = Infinity, step = 1) {
        if (!isFinite(start))
            throw new Error("Must have a valid 'start' value.");
        if (isNaN(to))
            throw new Error("Must have a valid 'to' value.");
        if (!isFinite(step))
            throw new Error("Must have a valid 'step' value.");
        step = Math.abs(step);
        if (!isFinite(to))
            return Enumerable.range(start, Infinity, (start < to) ? (+step) : (-step));
        return new Enumerable(() => {
            var value;
            return start < to
                ? new EnumeratorBase(() => {
                    value = start;
                }, (yielder) => {
                    var result = value <= to && yielder.yieldReturn(value);
                    if (result)
                        value += step;
                    return result;
                })
                : new EnumeratorBase(() => {
                    value = start;
                }, (yielder) => {
                    var result = value >= to && yielder.yieldReturn(value);
                    if (result)
                        value -= step;
                    return result;
                });
        });
    }
    static matches(input, pattern, flags = "") {
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
        return new Enumerable(() => {
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
            ? new Enumerable(() => {
                var c = count;
                var index = 0;
                return new EnumeratorBase(() => {
                    index = 0;
                }, (yielder) => {
                    var current = index++;
                    return current < c && yielder.yieldReturn(factory(current));
                });
            })
            : new Enumerable(() => {
                var index = 0;
                return new EnumeratorBase(() => {
                    index = 0;
                }, (yielder) => yielder.yieldReturn(factory(index++)));
            });
    }
    static unfold(seed, valueFactory, skipSeed = false) {
        return new Enumerable(() => {
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
            });
        });
    }
    static defer(enumerableFactory) {
        return new Enumerable(() => {
            var enumerator;
            return new EnumeratorBase(() => {
                enumerator = enumerableFactory().getEnumerator();
            }, (yielder) => enumerator.moveNext() && yielder.yieldReturn(enumerator.current), () => {
                dispose(enumerator);
            });
        });
    }
    static forEach(enumerable, action) {
        if (enumerable) {
            using(enumeratorFrom(enumerable), e => {
                enumeratorForEach(e, action);
            });
        }
    }
    static map(enumerable, selector) {
        return enumerable && using(enumeratorFrom(enumerable), e => {
            var result = [];
            enumeratorForEach(e, (e, i) => {
                result[i] = selector(e);
            });
            return result;
        });
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
    forEach(action) {
        var _ = this;
        _.throwIfDisposed();
        var index = 0;
        using(_.getEnumerator(), e => {
            while (_.throwIfDisposed() && e.moveNext()) {
                if (action(e.current, index++) === false)
                    break;
            }
        });
    }
    toArray(predicate) {
        var result = [];
        if (predicate)
            return this.where(predicate).toArray();
        this.forEach((x, i) => {
            result[i] = x;
        });
        return result;
    }
    asEnumerable() {
        var _ = this;
        return new Enumerable(() => _.getEnumerator());
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
        this.forEach(x => {
            obj[keySelector(x)] = elementSelector(x);
        });
        return obj;
    }
    toDictionary(keySelector, elementSelector, compareSelector = Functions.Identity) {
        var dict = new Dictionary(compareSelector);
        this.forEach(x => dict.addByKeyValue(keySelector(x), elementSelector(x)));
        return dict;
    }
    toJoinedString(separator = "", selector = Functions.Identity) {
        return this.select(selector).toArray().join(separator);
    }
    doAction(action) {
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
                    var actionResult = action(enumerator.current, index++);
                    if (actionResult === false || actionResult === 0)
                        return yielder.yieldBreak();
                    if (actionResult !== 2)
                        return yielder.yieldReturn(enumerator.current);
                }
                return false;
            }, () => {
                dispose(enumerator);
            });
        }, () => {
            disposed = true;
        });
    }
    force(defaultAction = 0) {
        this.throwIfDisposed();
        this.doAction(element => defaultAction);
    }
    skip(count) {
        var _ = this;
        _.throwIfDisposed();
        if (!count || isNaN(count) || count < 0)
            return _;
        if (!isFinite(count))
            return Enumerable.empty();
        Integer.assert(count, "count");
        var c = count;
        return this.doAction((element, index) => index < c
            ? 2
            : 1);
    }
    skipWhile(predicate) {
        this.throwIfDisposed();
        var skipping = true;
        return this.doAction((element, index) => {
            if (skipping)
                skipping = predicate(element, index);
            return skipping
                ? 2
                : 1;
        });
    }
    take(count) {
        if (!count || isNaN(count) || count < 0)
            return Enumerable.empty();
        var _ = this;
        _.throwIfDisposed();
        if (!isFinite(count))
            return _;
        Integer.assert(count, "count");
        var c = count;
        return _.doAction((element, index) => index < c);
    }
    takeWhile(predicate) {
        this.throwIfDisposed();
        return this.doAction((element, index) => predicate(element, index)
            ? 1
            : 0);
    }
    takeUntil(predicate, includeUntilValue) {
        this.throwIfDisposed();
        if (!includeUntilValue)
            return this.doAction((element, index) => predicate(element, index)
                ? 0
                : 1);
        var found = false;
        return this.doAction((element, index) => {
            if (found)
                return 0;
            found = predicate(element, index);
            return 1;
        });
    }
    takeExceptLast(count = 1) {
        var _ = this;
        if (!count || isNaN(count) || count <= 0)
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
    takeFromLast(count) {
        if (!count || isNaN(count) || count <= 0)
            return Enumerable.empty();
        var _ = this;
        if (!isFinite(count))
            return _.reverse();
        Integer.assert(count, "count");
        return _.reverse().take(count);
    }
    traverseBreadthFirst(func, resultSelector) {
        var _ = this;
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
                        .fromArray(buffer)
                        .selectMany(func);
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
            });
        });
    }
    traverseDepthFirst(func, resultSelector) {
        var _ = this;
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
                        var value = resultSelector(enumerator.current, len);
                        enumeratorStack[len++] = enumerator;
                        enumerator = func(enumerator.current).getEnumerator();
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
                    disposeThese(enumeratorStack);
                }
            });
        });
    }
    flatten() {
        var _ = this;
        return new Enumerable(() => {
            var enumerator;
            var middleEnumerator = null;
            return new EnumeratorBase(() => {
                enumerator = _.getEnumerator();
            }, (yielder) => {
                while (true) {
                    if (middleEnumerator != null) {
                        if (middleEnumerator.moveNext()) {
                            return yielder.yieldReturn(middleEnumerator.current);
                        }
                        else {
                            middleEnumerator = null;
                        }
                    }
                    if (enumerator.moveNext()) {
                        var c = enumerator.current;
                        if (Array.isArray(c)) {
                            middleEnumerator.dispose();
                            middleEnumerator = Enumerable.fromArray(c)
                                .selectMany(Functions.Identity)
                                .flatten()
                                .getEnumerator();
                            continue;
                        }
                        else {
                            return yielder.yieldReturn(enumerator.current);
                        }
                    }
                    return false;
                }
            }, () => {
                dispose(enumerator, middleEnumerator);
            });
        });
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
            });
        });
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
            });
        });
    }
    select(selector) {
        var _ = this, disposed = !_.throwIfDisposed();
        if (selector.length < 2)
            return new WhereSelectEnumerable(_, null, selector);
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
                    : false;
            }, () => {
                dispose(enumerator);
            });
        }, () => {
            disposed = true;
        });
    }
    selectMany(collectionSelector, resultSelector) {
        var _ = this;
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
            });
        });
    }
    choose(selector) {
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
            });
        }, () => {
            disposed = true;
        });
    }
    where(predicate) {
        var _ = this, disposed = !_.throwIfDisposed();
        if (predicate.length < 2)
            return new WhereEnumerable(_, predicate);
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
            });
        }, () => {
            disposed = true;
        });
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
            .where(x => typeof x === typeName);
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
                    Enumerable.forEach(second, key => keys.addByKeyValue(key, true));
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
            });
        }, () => {
            disposed = true;
        });
    }
    distinct(compareSelector) {
        return this.except(null, compareSelector);
    }
    distinctUntilChanged(compareSelector) {
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
                    else if (compareKey === key) {
                        continue;
                    }
                    compareKey = key;
                    return yielder.yieldReturn(enumerator.current);
                }
                return false;
            }, () => {
                dispose(enumerator);
            });
        }, () => {
            disposed = true;
        });
    }
    reverse() {
        var _ = this, disposed = !_.throwIfDisposed();
        return new Enumerable(() => {
            var buffer;
            var index = 0;
            return new EnumeratorBase(() => {
                throwIfDisposed(disposed);
                buffer = _.toArray();
                index = buffer.length;
            }, (yielder) => index > 0
                && yielder.yieldReturn(buffer[--index]), () => {
                buffer.length = 0;
            });
        }, () => {
            disposed = true;
        });
    }
    shuffle() {
        var _ = this, disposed = !_.throwIfDisposed();
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
        var _ = this;
        _.throwIfDisposed();
        var count = 0;
        if (predicate) {
            _.forEach((x, i) => {
                if (predicate(x, i))
                    ++count;
            });
        }
        else {
            _.forEach(() => {
                ++count;
            });
        }
        return count;
    }
    all(predicate) {
        var result = true;
        this.forEach(x => {
            if (!predicate(x)) {
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
        var result = false;
        if (predicate) {
            this.forEach(x => {
                result = predicate(x);
                return !result;
            });
        }
        else {
            this.forEach(() => {
                result = true;
                return false;
            });
        }
        return result;
    }
    some(predicate) {
        return this.any(predicate);
    }
    isEmpty() {
        return !this.any();
    }
    contains(value, compareSelector) {
        return compareSelector
            ? this.any(v => compareSelector(v) === compareSelector(value))
            : this.any(v => v === value);
    }
    indexOf(value, compareSelector) {
        var found = -1;
        if (compareSelector)
            this.forEach((element, i) => {
                if (Values.areEqual(compareSelector(element), compareSelector(value), true)) {
                    found = i;
                    return false;
                }
            });
        else
            this.forEach((element, i) => {
                if (Values.areEqual(element, value, true)) {
                    found = i;
                    return false;
                }
            });
        return found;
    }
    lastIndexOf(value, compareSelector) {
        var result = -1;
        if (compareSelector)
            this.forEach((element, i) => {
                if (Values.areEqual(compareSelector(element), compareSelector(value), true))
                    result
                        = i;
            });
        else
            this.forEach((element, i) => {
                if (Values.areEqual(element, value, true))
                    result = i;
            });
        return result;
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
            });
        });
    }
    zip(second, resultSelector) {
        var _ = this;
        return new Enumerable(() => {
            var firstEnumerator;
            var secondEnumerator;
            var index = 0;
            return new EnumeratorBase(() => {
                index = 0;
                firstEnumerator = _.getEnumerator();
                secondEnumerator = enumeratorFrom(second);
            }, (yielder) => firstEnumerator.moveNext() && secondEnumerator.moveNext()
                && yielder.yieldReturn(resultSelector(firstEnumerator.current, secondEnumerator.current, index++)), () => {
                dispose(firstEnumerator, secondEnumerator);
            });
        });
    }
    zipMultiple(second, resultSelector) {
        var _ = this;
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
    concatWith(other) {
        var _ = this;
        return new Enumerable(() => {
            var firstEnumerator;
            var secondEnumerator;
            return new EnumeratorBase(() => {
                firstEnumerator = _.getEnumerator();
            }, (yielder) => {
                if (firstEnumerator != null) {
                    if (firstEnumerator.moveNext())
                        return yielder.yieldReturn(firstEnumerator.current);
                    secondEnumerator = enumeratorFrom(other);
                    firstEnumerator.dispose();
                    firstEnumerator = null;
                }
                if (secondEnumerator.moveNext())
                    return yielder.yieldReturn(secondEnumerator.current);
                return false;
            }, () => {
                dispose(firstEnumerator, secondEnumerator);
            });
        });
    }
    merge(enumerables) {
        var _ = this;
        if (!enumerables.length)
            return _;
        if (enumerables.length == 1)
            return _.concatWith(enumerables[0]);
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
            });
        });
    }
    concat(...enumerables) {
        var _ = this;
        if (enumerables.length == 0)
            return _;
        if (enumerables.length == 1)
            return _.concatWith(enumerables[0]);
        return _.merge(enumerables);
    }
    insertAt(index, other) {
        if (isNaN(index) || index < 0 || !isFinite(index))
            throw new Error("'index' is invalid or out of bounds.");
        Integer.assert(index, "index");
        var n = index;
        var _ = this;
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
            });
        });
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
            });
        });
    }
    alternateSingle(value) {
        return this.alternateMultiple(Enumerable.make(value));
    }
    alternate(...sequence) {
        return this.alternateMultiple(sequence);
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
                Enumerable.from(second)
                    .forEach(key => {
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
                dispose(enumerator);
            });
        });
    }
    sequenceEqual(second, equalityComparer = Values.areEqual) {
        return using(this.getEnumerator(), e1 => using(Enumerable.from(second).getEnumerator(), e2 => {
            while (e1.moveNext()) {
                if (!e2.moveNext() || !equalityComparer(e1.current, e2.current))
                    return false;
            }
            return !e2.moveNext();
        }));
    }
    union(second, compareSelector = Functions.Identity) {
        var _ = this;
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
                    secondEnumerator = Enumerable.from(second).getEnumerator();
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
            });
        });
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
    groupBy(keySelector, elementSelector, compareSelector) {
        var _ = this;
        if (!elementSelector)
            elementSelector = Functions.Identity;
        return new Enumerable(() => _.toLookup(keySelector, elementSelector, compareSelector)
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
                while (len < size && enumerator.moveNext) {
                    array[len++] = enumerator.current;
                }
                array.length = len;
                return len && yielder.yieldReturn(array);
            }, () => {
                dispose(enumerator);
            });
        });
    }
    aggregate(func, seed) {
        return this.scan(func, seed).lastOrDefault();
    }
    average(selector = Type.numberOrNaN) {
        var sum = 0;
        var sumInfinite = 0;
        var count = 0;
        this.forEach(function (x) {
            var value = selector(x);
            if (isNaN(value)) {
                sum = NaN;
                return false;
            }
            if (isFinite(value))
                sum += value;
            else
                sumInfinite += value > 0 ? (+1) : (-1);
            ++count;
        });
        if (sumInfinite)
            return sumInfinite * Infinity;
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
                sumInfinite += value > 0 ? (+1) : (-1);
        });
        return isNaN(sum) ? NaN : (sumInfinite ? (sumInfinite * Infinity) : sum);
    }
    product(selector = Type.numberOrNaN) {
        var result = 1, exists = false;
        this.forEach(x => {
            exists = true;
            var value = selector(x);
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
    elementAt(index) {
        if (isNaN(index) || index < 0 || !isFinite(index))
            throw new Error("'index' is invalid or out of bounds.");
        Integer.assert(index, "index");
        var n = index;
        var _ = this;
        _.throwIfDisposed();
        var value = undefined;
        var found = false;
        _.forEach((x, i) => {
            if (i == n) {
                value = x;
                found = true;
                return false;
            }
        });
        if (!found)
            throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
        return value;
    }
    elementAtOrDefault(index, defaultValue = null) {
        if (isNaN(index) || index < 0 || !isFinite(index))
            throw new Error("'index' is invalid or out of bounds.");
        Integer.assert(index, "index");
        var n = index;
        var _ = this;
        _.throwIfDisposed();
        var value = undefined;
        var found = false;
        _.forEach((x, i) => {
            if (i == n) {
                value = x;
                found = true;
                return false;
            }
        });
        return (!found) ? defaultValue : value;
    }
    first() {
        var _ = this;
        _.throwIfDisposed();
        var value = undefined;
        var found = false;
        _.forEach(x => {
            value = x;
            found = true;
            return false;
        });
        if (!found)
            throw new Error("first:No element satisfies the condition.");
        return value;
    }
    firstOrDefault(defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        var value = undefined;
        var found = false;
        _.forEach(x => {
            value = x;
            found = true;
            return false;
        });
        return (!found) ? defaultValue : value;
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
    single() {
        var _ = this;
        _.throwIfDisposed();
        var value = undefined;
        var found = false;
        _.forEach(x => {
            if (!found) {
                found = true;
                value = x;
            }
            else
                throw new Error("single:sequence contains more than one element.");
        });
        if (!found)
            throw new Error("single:No element satisfies the condition.");
        return value;
    }
    singleOrDefault(defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        var value = undefined;
        var found = false;
        _.forEach(x => {
            if (!found) {
                found = true;
                value = x;
            }
            else
                throw new Error("single:sequence contains more than one element.");
        });
        return (!found) ? defaultValue : value;
    }
    share() {
        var _ = this;
        _.throwIfDisposed();
        var sharedEnumerator;
        return new Enumerable(() => {
            return new EnumeratorBase(() => {
                if (!sharedEnumerator)
                    sharedEnumerator = _.getEnumerator();
            }, (yielder) => sharedEnumerator.moveNext()
                && yielder.yieldReturn(sharedEnumerator.current));
        }, () => {
            dispose(sharedEnumerator);
        });
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
}
class ArrayEnumerable extends Enumerable {
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
        var s = this.source;
        if (!s)
            return [];
        if (Array.isArray(s))
            return s.slice();
        var len = s.length, result = ArrayUtility.initialize(len);
        for (let i = 0; i < len; ++i) {
            result[i] = s[i];
        }
        return result;
    }
    asEnumerable() {
        return new ArrayEnumerable(this._source);
    }
    forEach(action) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source;
        if (source) {
            for (let i = 0; i < source.length; ++i) {
                if (action(source[i], i) === false)
                    break;
            }
        }
    }
    any(predicate) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source ? source.length : 0;
        return len && (!predicate || super.any(predicate));
    }
    count(predicate) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source, len = source ? source.length : 0;
        return len && (predicate ? super.count(predicate) : len);
    }
    elementAt(index) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source;
        return (index < source.length && index >= 0)
            ? source[index]
            : super.elementAt(index);
    }
    elementAtOrDefault(index, defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source;
        return (index < source.length && index >= 0)
            ? source[index]
            : defaultValue;
    }
    first() {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source;
        return (source && source.length)
            ? source[0]
            : super.first();
    }
    firstOrDefault(defaultValue = null) {
        var _ = this;
        _.throwIfDisposed();
        var source = _._source;
        return (source && source.length)
            ? source[0]
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
        if (!count || count < 0)
            return _.asEnumerable();
        return new Enumerable(() => new ArrayEnumerator(() => _._source, count));
    }
    takeExceptLast(count = 1) {
        var _ = this, len = _._source ? _._source.length : 0;
        return _.take(len - count);
    }
    takeFromLast(count) {
        if (!count || count < 0)
            return Enumerable.empty();
        var _ = this, len = _._source
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
        return new ArrayEnumerable(this._source);
    }
    sequenceEqual(second, equalityComparer = Values.areEqual) {
        if (Array.isArray(second))
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
class WhereEnumerable extends Enumerable {
    constructor(prevSource, prevPredicate) {
        super(null);
        this.prevSource = prevSource;
        this.prevPredicate = prevPredicate;
    }
    where(predicate) {
        if (predicate.length > 1)
            return super.where(predicate);
        var prevPredicate = this.prevPredicate;
        var composedPredicate = (x) => prevPredicate(x) && predicate(x);
        return new WhereEnumerable(this.prevSource, composedPredicate);
    }
    select(selector) {
        if (selector.length > 1)
            return super.select(selector);
        return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector);
    }
    getEnumerator() {
        var predicate = this.prevPredicate;
        var source = this.prevSource;
        var enumerator;
        return new EnumeratorBase(() => {
            enumerator = source.getEnumerator();
        }, (yielder) => {
            while (enumerator.moveNext()) {
                if (predicate(enumerator.current))
                    return yielder.yieldReturn(enumerator.current);
            }
            return false;
        }, () => {
            dispose(enumerator);
        });
    }
    _onDispose() {
        super._onDispose();
        this.prevPredicate = null;
        this.prevSource = null;
    }
}
class WhereSelectEnumerable extends Enumerable {
    constructor(prevSource, prevPredicate, prevSelector) {
        super(null);
        this.prevSource = prevSource;
        this.prevPredicate = prevPredicate;
        this.prevSelector = prevSelector;
    }
    where(predicate) {
        if (predicate.length > 1)
            return super.where(predicate);
        return new WhereEnumerable(this, predicate);
    }
    select(selector) {
        if (selector.length > 1)
            return super.select(selector);
        var _ = this;
        var prevSelector = _.prevSelector;
        var composedSelector = (x) => selector(prevSelector(x));
        return new WhereSelectEnumerable(_.prevSource, _.prevPredicate, composedSelector);
    }
    getEnumerator() {
        var _ = this, predicate = _.prevPredicate, source = _.prevSource, selector = _.prevSelector, enumerator;
        return new EnumeratorBase(() => {
            enumerator = source.getEnumerator();
        }, (yielder) => {
            while (enumerator.moveNext()) {
                var c = enumerator.current;
                if (predicate == null || predicate(c)) {
                    return yielder.yieldReturn(selector(c));
                }
            }
            return false;
        }, () => {
            dispose(enumerator);
        });
    }
    _onDispose() {
        var _ = this;
        super._onDispose();
        _.prevPredicate = null;
        _.prevSource = null;
        _.prevSelector = null;
    }
}
class OrderedEnumerable extends Enumerable {
    constructor(source, keySelector, order, parent, comparer = Values.compare) {
        super(null);
        this.source = source;
        this.keySelector = keySelector;
        this.order = order;
        this.parent = parent;
        this.comparer = comparer;
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
        });
    }
    _onDispose() {
        super._onDispose();
        this.source = null;
        this.keySelector = null;
        this.order = null;
        this.parent = null;
    }
}
function createSortContext(orderedEnumerable, currentContext = null) {
    var context = new KeySortedContext(currentContext, orderedEnumerable.keySelector, orderedEnumerable.order, orderedEnumerable.comparer);
    if (orderedEnumerable.parent)
        return createSortContext(orderedEnumerable.parent, context);
    return context;
}
function throwIfDisposed(disposed, className = "Enumerable") {
    if (disposed)
        throw new ObjectDisposedException(className);
}
export default Enumerable;
//# sourceMappingURL=Linq.js.map