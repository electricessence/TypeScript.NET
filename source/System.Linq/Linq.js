/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../System/Compare', '../System/Types', '../System/Functions', '../System/Collections/Array/Compare', '../System/Collections/Array/Utility', '../System/Collections/Enumeration/ArrayEnumerator', '../System/Collections/Enumeration/Enumerator', '../System/Collections/Enumeration/EnumeratorBase', '../System/Collections/Dictionaries/Dictionary', '../System/Collections/Queue', '../System/Disposable/Utility', '../System/Disposable/DisposableBase', '../System/Disposable/ObjectDisposedException'], function (require, exports, Values, Types, BaseFunctions, ArrayCompare, ArrayUtility, ArrayEnumerator, Enumerator, EnumeratorBase, Dictionary, Queue, DisposeUtility, DisposableBase, ObjectDisposedException) {
    var dispose = DisposeUtility.dispose;
    var using = DisposeUtility.using;
    var enumeratorFrom = Enumerator.from;
    var enumeratorForEach = Enumerator.forEach;
    'use strict';
    var LinqFunctions = (function (_super) {
        __extends(LinqFunctions, _super);
        function LinqFunctions() {
            _super.apply(this, arguments);
        }
        LinqFunctions.prototype.Greater = function (a, b) {
            return a > b ? a : b;
        };
        LinqFunctions.prototype.Lesser = function (a, b) {
            return a < b ? a : b;
        };
        return LinqFunctions;
    })(BaseFunctions);
    var Functions = new LinqFunctions();
    Object.freeze(Functions);
    var INT_0 = 0 | 0, INT_NEG1 = -1 | 0, INT_POS1 = +1 | 0, LENGTH = 'length', GET_ENUMERATOR = 'getEnumerator', UNSUPPORTED_ENUMERABLE = "Unsupported enumerable.";
    var Linq;
    (function (Linq) {
        var Enumerable = (function (_super) {
            __extends(Enumerable, _super);
            function Enumerable(_enumeratorFactory, finalizer) {
                _super.call(this, finalizer);
                this._enumeratorFactory = _enumeratorFactory;
            }
            Enumerable.fromArray = function (array) {
                return new ArrayEnumerable(array);
            };
            Enumerable.from = function (source) {
                if (typeof source === Types.Object) {
                    if (source instanceof Enumerable)
                        return source;
                    if (source instanceof Array)
                        return new ArrayEnumerable(source);
                    if (GET_ENUMERATOR in source)
                        return new Enumerable(function () { return source.getEnumerator(); });
                    if (LENGTH in source)
                        return new ArrayEnumerable(source);
                }
                throw new Error(UNSUPPORTED_ENUMERABLE);
            };
            Enumerable.toArray = function (source) {
                if (typeof source === Types.Object) {
                    if (source instanceof Array)
                        return source.slice();
                    if (LENGTH in source)
                        source = new ArrayEnumerable(source);
                    if (source instanceof Enumerable)
                        return source.toArray();
                    if (GET_ENUMERATOR in source) {
                        var result = [];
                        enumeratorForEach(source.getEnumerator(), function (e, i) {
                            result[i] = e;
                        });
                        return result;
                    }
                }
                throw new Error(UNSUPPORTED_ENUMERABLE);
            };
            Enumerable.prototype.getEnumerator = function () {
                this.throwIfDisposed();
                return this._enumeratorFactory();
            };
            Enumerable.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._enumeratorFactory = null;
            };
            Enumerable.choice = function (values) {
                return new Enumerable(function () { return new EnumeratorBase(null, function (yielder) {
                    return yielder.yieldReturn(values[(Math.random() * values.length) | 0]);
                }); });
            };
            Enumerable.cycle = function (values) {
                return new Enumerable(function () {
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        index = INT_0;
                    }, function (yielder) {
                        if (index >= values.length)
                            index = INT_0;
                        return yielder.yieldReturn(values[index++]);
                    });
                });
            };
            Enumerable.empty = function () {
                return new Enumerable(function () { return new EnumeratorBase(null, Functions.False); });
            };
            Enumerable.repeat = function (element, count) {
                if (count === void 0) { count = Infinity; }
                if (isNaN(count) || count <= 0)
                    return Enumerable.empty();
                return isFinite(count) && assertInteger(count, "count")
                    ? new Enumerable(function () {
                        var c = count | 0;
                        var index = INT_0;
                        return new EnumeratorBase(function () {
                            index = INT_0;
                        }, function (yielder) { return (index++ < c) && yielder.yieldReturn(element); });
                    })
                    : new Enumerable(function () {
                        return new EnumeratorBase(null, function (yielder) { return yielder.yieldReturn(element); });
                    });
            };
            Enumerable.repeatWithFinalize = function (initializer, finalizer) {
                return new Enumerable(function () {
                    var element;
                    return new EnumeratorBase(function () {
                        element = initializer();
                    }, function (yielder) { return yielder.yieldReturn(element); }, function () {
                        finalizer(element);
                    });
                });
            };
            Enumerable.make = function (element) {
                return Enumerable.repeat(element, INT_POS1);
            };
            Enumerable.range = function (start, count, step) {
                if (start === void 0) { start = 0; }
                if (count === void 0) { count = Infinity; }
                if (step === void 0) { step = 1; }
                if (!isFinite(start))
                    throw new Error("Must have a valid 'start' value.");
                if (isNaN(count) || count <= 0)
                    return Enumerable.empty();
                if (!isFinite(step))
                    throw new Error("Must have a valid 'step' value.");
                return isFinite(count) && assertInteger(count, "count")
                    ? new Enumerable(function () {
                        var value;
                        var c = count | 0;
                        var index = INT_0;
                        return new EnumeratorBase(function () {
                            index = INT_0;
                            value = start;
                        }, function (yielder) {
                            var result = index++ < c
                                && yielder.yieldReturn(value);
                            if (result && index < count)
                                value += step;
                            return result;
                        });
                    })
                    : new Enumerable(function () {
                        var value;
                        return new EnumeratorBase(function () {
                            value = start;
                        }, function (yielder) {
                            var current = value;
                            value += step;
                            return yielder.yieldReturn(current);
                        });
                    });
            };
            Enumerable.rangeDown = function (start, count, step) {
                if (start === void 0) { start = 0; }
                if (count === void 0) { count = Infinity; }
                if (step === void 0) { step = 1; }
                step = Math.abs(step) * -1;
                return Enumerable.range(start, count, step);
            };
            Enumerable.toInfinity = function (start, step) {
                if (start === void 0) { start = 0; }
                if (step === void 0) { step = 1; }
                return Enumerable.range(start, Infinity, step);
            };
            Enumerable.toNegativeInfinity = function (start, step) {
                if (start === void 0) { start = 0; }
                if (step === void 0) { step = 1; }
                return Enumerable.rangeDown(start, Infinity, step);
            };
            Enumerable.rangeTo = function (start, to, step) {
                if (start === void 0) { start = 0; }
                if (to === void 0) { to = Infinity; }
                if (step === void 0) { step = 1; }
                if (!isFinite(start))
                    throw new Error("Must have a valid 'start' value.");
                if (isNaN(to))
                    throw new Error("Must have a valid 'to' value.");
                if (!isFinite(step))
                    throw new Error("Must have a valid 'step' value.");
                step = Math.abs(step);
                if (!isFinite(to))
                    return Enumerable.range(start, Infinity, (start < to) ? (+step) : (-step));
                return new Enumerable(function () {
                    var value;
                    return start < to
                        ? new EnumeratorBase(function () {
                            value = start;
                        }, function (yielder) {
                            var result = value <= to && yielder.yieldReturn(value);
                            if (result)
                                value += step;
                            return result;
                        })
                        : new EnumeratorBase(function () {
                            value = start;
                        }, function (yielder) {
                            var result = value >= to && yielder.yieldReturn(value);
                            if (result)
                                value -= step;
                            return result;
                        });
                });
            };
            Enumerable.matches = function (input, pattern, flags) {
                if (flags === void 0) { flags = ""; }
                var type = typeof input;
                if (type != Types.String)
                    throw new Error("Cannot exec RegExp matches of type '" + type + "'.");
                if (pattern instanceof RegExp) {
                    flags += (pattern.ignoreCase) ? "i" : "";
                    flags += (pattern.multiline) ? "m" : "";
                    pattern = pattern.source;
                }
                if (flags.indexOf("g") === -1)
                    flags += "g";
                return new Enumerable(function () {
                    var regex;
                    return new EnumeratorBase(function () {
                        regex = new RegExp(pattern, flags);
                    }, function (yielder) {
                        var match = regex.exec(input);
                        return (match !== null) ? yielder.yieldReturn(match) : false;
                    });
                });
            };
            Enumerable.generate = function (factory, count) {
                if (count === void 0) { count = Infinity; }
                if (isNaN(count) || count <= 0)
                    return Enumerable.empty();
                return isFinite(count) && assertInteger(count, "count")
                    ? new Enumerable(function () {
                        var c = count | 0;
                        var index = INT_0;
                        return new EnumeratorBase(function () {
                            index = INT_0;
                        }, function (yielder) {
                            var current = index++;
                            return current < c && yielder.yieldReturn(factory(current));
                        });
                    })
                    : new Enumerable(function () {
                        var index = INT_0;
                        return new EnumeratorBase(function () {
                            index = INT_0;
                        }, function (yielder) { return yielder.yieldReturn(factory(index++)); });
                    });
            };
            Enumerable.unfold = function (seed, valueFactory, skipSeed) {
                if (skipSeed === void 0) { skipSeed = false; }
                return new Enumerable(function () {
                    var index = INT_0;
                    var value;
                    var isFirst;
                    return new EnumeratorBase(function () {
                        index = INT_0;
                        value = seed;
                        isFirst = !skipSeed;
                    }, function (yielder) {
                        var i = index++;
                        if (isFirst)
                            isFirst = false;
                        else
                            value = valueFactory(value, i);
                        return yielder.yieldReturn(value);
                    });
                });
            };
            Enumerable.defer = function (enumerableFactory) {
                return new Enumerable(function () {
                    var enumerator;
                    return new EnumeratorBase(function () {
                        enumerator = enumerableFactory().getEnumerator();
                    }, function (yielder) { return enumerator.moveNext() && yielder.yieldReturn(enumerator.current); }, function () {
                        dispose(enumerator);
                    });
                });
            };
            Enumerable.forEach = function (enumerable, action) {
                if (enumerable) {
                    using(Enumerator.from(enumerable), function (e) {
                        Enumerator.forEach(e, action);
                    });
                }
            };
            Enumerable.max = function (values) {
                return values
                    .takeUntil(function (v) { return v == +Infinity; }, true)
                    .aggregate(Functions.Greater);
            };
            Enumerable.min = function (values) {
                return values
                    .takeUntil(function (v) { return v == -Infinity; }, true)
                    .aggregate(Functions.Lesser);
            };
            Enumerable.prototype.forEach = function (action) {
                var _ = this;
                _.throwIfDisposed();
                var index = INT_0;
                using(_.getEnumerator(), function (e) {
                    while (_.throwIfDisposed() && e.moveNext()) {
                        if (action(e.current, index++) === false)
                            break;
                    }
                });
            };
            Enumerable.prototype.toArray = function (predicate) {
                var result = [];
                if (predicate)
                    return this.where(predicate).toArray();
                this.forEach(function (x, i) {
                    result[i] = x;
                });
                return result;
            };
            Enumerable.prototype.asEnumerable = function () {
                var _ = this;
                return new Enumerable(function () { return _.getEnumerator(); });
            };
            Enumerable.prototype.toLookup = function (keySelector, elementSelector, compareSelector) {
                if (elementSelector === void 0) { elementSelector = Functions.Identity; }
                if (compareSelector === void 0) { compareSelector = Functions.Identity; }
                var dict = new Dictionary(compareSelector);
                this.forEach(function (x) {
                    var key = keySelector(x);
                    var element = elementSelector(x);
                    var array = dict.getValue(key);
                    if (array !== undefined)
                        array.push(element);
                    else
                        dict.addByKeyValue(key, [element]);
                });
                return new Lookup(dict);
            };
            Enumerable.prototype.toMap = function (keySelector, elementSelector) {
                var obj = {};
                this.forEach(function (x) {
                    obj[keySelector(x)] = elementSelector(x);
                });
                return obj;
            };
            Enumerable.prototype.toDictionary = function (keySelector, elementSelector, compareSelector) {
                if (compareSelector === void 0) { compareSelector = Functions.Identity; }
                var dict = new Dictionary(compareSelector);
                this.forEach(function (x) { return dict.addByKeyValue(keySelector(x), elementSelector(x)); });
                return dict;
            };
            Enumerable.prototype.toJoinedString = function (separator, selector) {
                if (separator === void 0) { separator = ""; }
                if (selector === void 0) { selector = Functions.Identity; }
                return this.select(selector).toArray().join(separator);
            };
            Enumerable.prototype.doAction = function (action) {
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var enumerator;
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        index = INT_0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        throwIfDisposed(disposed);
                        while (enumerator.moveNext()) {
                            var actionResult = action(enumerator.current, index++);
                            if (actionResult === false || actionResult === 0)
                                return yielder.yieldBreak();
                            if (actionResult !== 2)
                                return yielder.yieldReturn(enumerator.current);
                        }
                        return false;
                    }, function () {
                        dispose(enumerator);
                    });
                }, function () {
                    disposed = true;
                });
            };
            Enumerable.prototype.force = function (defaultAction) {
                if (defaultAction === void 0) { defaultAction = 0; }
                this.throwIfDisposed();
                this.doAction(function (element) { return defaultAction; });
            };
            Enumerable.prototype.skip = function (count) {
                var _ = this;
                _.throwIfDisposed();
                if (!count || isNaN(count) || count < 0)
                    return _;
                if (!isFinite(count))
                    return Enumerable.empty();
                assertInteger(count, "count");
                var c = count | 0;
                return this.doAction(function (element, index) {
                    return index < c
                        ? 2
                        : 1;
                });
            };
            Enumerable.prototype.skipWhile = function (predicate) {
                this.throwIfDisposed();
                var skipping = true;
                return this.doAction(function (element, index) {
                    if (skipping)
                        skipping = predicate(element, index);
                    return skipping
                        ? 2
                        : 1;
                });
            };
            Enumerable.prototype.take = function (count) {
                if (!count || isNaN(count) || count < 0)
                    return Enumerable.empty();
                var _ = this;
                _.throwIfDisposed();
                if (!isFinite(count))
                    return _;
                assertInteger(count, "count");
                var c = count | 0;
                return _.doAction(function (element, index) { return index < c; });
            };
            Enumerable.prototype.takeWhile = function (predicate) {
                this.throwIfDisposed();
                return this.doAction(function (element, index) {
                    return predicate(element, index)
                        ? 1
                        : 0;
                });
            };
            Enumerable.prototype.takeUntil = function (predicate, includeUntilValue) {
                this.throwIfDisposed();
                if (!includeUntilValue)
                    return this.doAction(function (element, index) {
                        return predicate(element, index)
                            ? 0
                            : 1;
                    });
                var found = false;
                return this.doAction(function (element, index) {
                    if (found)
                        return 0;
                    found = predicate(element, index);
                    return 1;
                });
            };
            Enumerable.prototype.takeExceptLast = function (count) {
                if (count === void 0) { count = 1; }
                var _ = this;
                if (!count || isNaN(count) || count <= 0)
                    return _;
                if (!isFinite(count))
                    return Enumerable.empty();
                assertInteger(count, "count");
                var c = count | 0;
                return new Enumerable(function () {
                    var enumerator;
                    var q;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        q = new Queue();
                    }, function (yielder) {
                        while (enumerator.moveNext()) {
                            q.enqueue(enumerator.current);
                            if (q.count > c)
                                return yielder.yieldReturn(q.dequeue());
                        }
                        return false;
                    }, function () {
                        dispose(enumerator, q);
                    });
                });
            };
            Enumerable.prototype.takeFromLast = function (count) {
                if (!count || isNaN(count) || count <= 0)
                    return Enumerable.empty();
                var _ = this;
                if (!isFinite(count))
                    return _.reverse();
                assertInteger(count, "count");
                return _.reverse().take(count | 0);
            };
            Enumerable.prototype.traverseBreadthFirst = function (func, resultSelector) {
                var _ = this;
                return new Enumerable(function () {
                    var enumerator;
                    var nestLevel = INT_0;
                    var buffer, len;
                    return new EnumeratorBase(function () {
                        nestLevel = INT_0;
                        buffer = [];
                        len = 0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
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
                    }, function () {
                        dispose(enumerator);
                        buffer.length = 0;
                    });
                });
            };
            Enumerable.prototype.traverseDepthFirst = function (func, resultSelector) {
                var _ = this;
                return new Enumerable(function () {
                    var enumeratorStack = [];
                    var enumerator;
                    var len;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        len = 0;
                    }, function (yielder) {
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
                    }, function () {
                        try {
                            dispose(enumerator);
                        }
                        finally {
                            DisposeUtility.disposeThese(enumeratorStack);
                        }
                    });
                });
            };
            Enumerable.prototype.flatten = function () {
                var _ = this;
                return new Enumerable(function () {
                    var enumerator;
                    var middleEnumerator = null;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
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
                                if (c instanceof Array) {
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
                    }, function () {
                        dispose(enumerator, middleEnumerator);
                    });
                });
            };
            Enumerable.prototype.pairwise = function (selector) {
                var _ = this;
                return new Enumerable(function () {
                    var enumerator;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        enumerator.moveNext();
                    }, function (yielder) {
                        var prev = enumerator.current;
                        return enumerator.moveNext()
                            && yielder.yieldReturn(selector(prev, enumerator.current));
                    }, function () {
                        dispose(enumerator);
                    });
                });
            };
            Enumerable.prototype.scan = function (func, seed) {
                var isUseSeed = seed !== undefined;
                var _ = this;
                return new Enumerable(function () {
                    var enumerator;
                    var value;
                    var isFirst;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        isFirst = true;
                    }, function (yielder) {
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
                    }, function () {
                        dispose(enumerator);
                    });
                });
            };
            Enumerable.prototype.select = function (selector) {
                var _ = this, disposed = !_.throwIfDisposed();
                if (selector.length < 2)
                    return new WhereSelectEnumerable(_, null, selector);
                return new Enumerable(function () {
                    var enumerator;
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        index = INT_0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        throwIfDisposed(disposed);
                        return enumerator.moveNext()
                            ? yielder.yieldReturn(selector(enumerator.current, index++))
                            : false;
                    }, function () {
                        dispose(enumerator);
                    });
                }, function () {
                    disposed = true;
                });
            };
            Enumerable.prototype.selectMany = function (collectionSelector, resultSelector) {
                var _ = this;
                if (!resultSelector)
                    resultSelector = function (a, b) { return b; };
                return new Enumerable(function () {
                    var enumerator;
                    var middleEnumerator;
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        middleEnumerator = undefined;
                        index = INT_0;
                    }, function (yielder) {
                        if (middleEnumerator === undefined && !enumerator.moveNext())
                            return false;
                        do {
                            if (!middleEnumerator) {
                                var middleSeq = collectionSelector(enumerator.current, index++);
                                if (!middleSeq)
                                    continue;
                                middleEnumerator = Enumerator.from(middleSeq);
                            }
                            if (middleEnumerator.moveNext())
                                return yielder.yieldReturn(resultSelector(enumerator.current, middleEnumerator.current));
                            middleEnumerator.dispose();
                            middleEnumerator = null;
                        } while (enumerator.moveNext());
                        return false;
                    }, function () {
                        dispose(enumerator, middleEnumerator);
                        enumerator = null;
                        middleEnumerator = null;
                    });
                });
            };
            Enumerable.prototype.choose = function (selector) {
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var enumerator;
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        index = INT_0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        throwIfDisposed(disposed);
                        while (enumerator.moveNext()) {
                            var result = selector(enumerator.current, index++);
                            if (result !== null && result !== undefined)
                                return yielder.yieldReturn(result);
                        }
                        return false;
                    }, function () {
                        dispose(enumerator);
                    });
                }, function () {
                    disposed = true;
                });
            };
            Enumerable.prototype.where = function (predicate) {
                var _ = this, disposed = !_.throwIfDisposed();
                if (predicate.length < 2)
                    return new WhereEnumerable(_, predicate);
                return new Enumerable(function () {
                    var enumerator;
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        index = INT_0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        throwIfDisposed(disposed);
                        while (enumerator.moveNext()) {
                            if (predicate(enumerator.current, index++))
                                return yielder.yieldReturn(enumerator.current);
                        }
                        return false;
                    }, function () {
                        dispose(enumerator);
                    });
                }, function () {
                    disposed = true;
                });
            };
            Enumerable.prototype.ofType = function (type) {
                var typeName;
                switch (type) {
                    case Number:
                        typeName = Types.Number;
                        break;
                    case String:
                        typeName = Types.String;
                        break;
                    case Boolean:
                        typeName = Types.Boolean;
                        break;
                    case Function:
                        typeName = Types.Function;
                        break;
                    default:
                        typeName = null;
                        break;
                }
                return ((typeName === null)
                    ? this.where(function (x) {
                        return x instanceof type;
                    })
                    : this.where(function (x) {
                        return typeof x === typeName;
                    }));
            };
            Enumerable.prototype.except = function (second, compareSelector) {
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var enumerator;
                    var keys;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        enumerator = _.getEnumerator();
                        keys = new Dictionary(compareSelector);
                        if (second)
                            Enumerable.forEach(second, function (key) { return keys.addByKeyValue(key, true); });
                    }, function (yielder) {
                        throwIfDisposed(disposed);
                        while (enumerator.moveNext()) {
                            var current = enumerator.current;
                            if (!keys.containsKey(current)) {
                                keys.addByKeyValue(current, true);
                                return yielder.yieldReturn(current);
                            }
                        }
                        return false;
                    }, function () {
                        dispose(enumerator);
                        keys.clear();
                    });
                }, function () {
                    disposed = true;
                });
            };
            Enumerable.prototype.distinct = function (compareSelector) {
                return this.except(null, compareSelector);
            };
            Enumerable.prototype.distinctUntilChanged = function (compareSelector) {
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var enumerator;
                    var compareKey;
                    var initial = true;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
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
                    }, function () {
                        dispose(enumerator);
                    });
                }, function () {
                    disposed = true;
                });
            };
            Enumerable.prototype.reverse = function () {
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var buffer;
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        buffer = _.toArray();
                        index = buffer.length | 0;
                    }, function (yielder) {
                        return index > INT_0
                            && yielder.yieldReturn(buffer[--index]);
                    }, function () {
                        buffer.length = 0;
                    });
                }, function () {
                    disposed = true;
                });
            };
            Enumerable.prototype.shuffle = function () {
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var buffer;
                    var capacity;
                    var len;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        buffer = _.toArray();
                        capacity = len = buffer.length;
                    }, function (yielder) {
                        if (!len)
                            return yielder.yieldBreak();
                        var selectedIndex = (Math.random() * len) | 0;
                        var selectedValue = buffer[selectedIndex];
                        buffer[selectedIndex] = buffer[--len];
                        buffer[len] = null;
                        if (len % 32 == 0)
                            buffer.length = len;
                        return yielder.yieldReturn(selectedValue);
                    }, function () {
                        buffer.length = 0;
                    });
                }, function () {
                    disposed = true;
                });
            };
            Enumerable.prototype.count = function (predicate) {
                var _ = this;
                _.throwIfDisposed();
                var count = INT_0;
                if (predicate) {
                    _.forEach(function (x, i) {
                        if (predicate(x, i))
                            ++count;
                    });
                }
                else {
                    _.forEach(function () {
                        ++count;
                    });
                }
                return count;
            };
            Enumerable.prototype.all = function (predicate) {
                var result = true;
                this.forEach(function (x) {
                    if (!predicate(x)) {
                        result = false;
                        return false;
                    }
                });
                return result;
            };
            Enumerable.prototype.every = function (predicate) {
                return this.all(predicate);
            };
            Enumerable.prototype.any = function (predicate) {
                var result = false;
                if (predicate) {
                    this.forEach(function (x) {
                        result = predicate(x);
                        return !result;
                    });
                }
                else {
                    this.forEach(function () {
                        result = true;
                        return false;
                    });
                }
                return result;
            };
            Enumerable.prototype.some = function (predicate) {
                return this.any(predicate);
            };
            Enumerable.prototype.isEmpty = function () {
                return !this.any();
            };
            Enumerable.prototype.contains = function (value, compareSelector) {
                return compareSelector
                    ? this.any(function (v) { return compareSelector(v) === compareSelector(value); })
                    : this.any(function (v) { return v === value; });
            };
            Enumerable.prototype.indexOf = function (value, compareSelector) {
                var found = INT_NEG1;
                if (compareSelector)
                    this.forEach(function (element, i) {
                        if (Values.areEqual(compareSelector(element), compareSelector(value), true)) {
                            found = i;
                            return false;
                        }
                    });
                else
                    this.forEach(function (element, i) {
                        if (Values.areEqual(element, value, true)) {
                            found = i;
                            return false;
                        }
                    });
                return found;
            };
            Enumerable.prototype.lastIndexOf = function (value, compareSelector) {
                var result = INT_NEG1;
                if (compareSelector)
                    this.forEach(function (element, i) {
                        if (Values.areEqual(compareSelector(element), compareSelector(value), true))
                            result
                                = i;
                    });
                else
                    this.forEach(function (element, i) {
                        if (Values.areEqual(element, value, true))
                            result = i;
                    });
                return result;
            };
            Enumerable.prototype.defaultIfEmpty = function (defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var enumerator;
                    var isFirst;
                    return new EnumeratorBase(function () {
                        isFirst = true;
                        throwIfDisposed(disposed);
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
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
                    }, function () {
                        dispose(enumerator);
                    });
                });
            };
            Enumerable.prototype.zip = function (second, resultSelector) {
                var _ = this;
                return new Enumerable(function () {
                    var firstEnumerator;
                    var secondEnumerator;
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        index = INT_0;
                        firstEnumerator = _.getEnumerator();
                        secondEnumerator = enumeratorFrom(second);
                    }, function (yielder) {
                        return firstEnumerator.moveNext() && secondEnumerator.moveNext()
                            && yielder.yieldReturn(resultSelector(firstEnumerator.current, secondEnumerator.current, index++));
                    }, function () {
                        dispose(firstEnumerator, secondEnumerator);
                    });
                });
            };
            Enumerable.prototype.zipMultiple = function (second, resultSelector) {
                var _ = this;
                if (!second.length)
                    return Enumerable.empty();
                return new Enumerable(function () {
                    var secondTemp;
                    var firstEnumerator;
                    var secondEnumerator;
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        secondTemp = new Queue(second);
                        index = INT_0;
                        firstEnumerator = _.getEnumerator();
                        secondEnumerator = null;
                    }, function (yielder) {
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
                    }, function () {
                        dispose(firstEnumerator, secondTemp);
                    });
                });
            };
            Enumerable.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector) {
                if (compareSelector === void 0) { compareSelector = Functions.Identity; }
                var _ = this;
                return new Enumerable(function () {
                    var outerEnumerator;
                    var lookup;
                    var innerElements = null;
                    var innerCount = INT_0;
                    return new EnumeratorBase(function () {
                        outerEnumerator = _.getEnumerator();
                        lookup = Enumerable.from(inner)
                            .toLookup(innerKeySelector, Functions.Identity, compareSelector);
                    }, function (yielder) {
                        while (true) {
                            if (innerElements != null) {
                                var innerElement = innerElements[innerCount++];
                                if (innerElement !== undefined)
                                    return yielder.yieldReturn(resultSelector(outerEnumerator.current, innerElement));
                                innerElement = null;
                                innerCount = INT_0;
                            }
                            if (outerEnumerator.moveNext()) {
                                var key = outerKeySelector(outerEnumerator.current);
                                innerElements = lookup.get(key);
                            }
                            else {
                                return yielder.yieldBreak();
                            }
                        }
                    }, function () {
                        dispose(outerEnumerator);
                    });
                });
            };
            Enumerable.prototype.groupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector) {
                if (compareSelector === void 0) { compareSelector = Functions.Identity; }
                var _ = this;
                return new Enumerable(function () {
                    var enumerator;
                    var lookup = null;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        lookup = Enumerable.from(inner)
                            .toLookup(innerKeySelector, Functions.Identity, compareSelector);
                    }, function (yielder) {
                        return enumerator.moveNext()
                            && yielder.yieldReturn(resultSelector(enumerator.current, lookup.get(outerKeySelector(enumerator.current))));
                    }, function () {
                        dispose(enumerator);
                    });
                });
            };
            Enumerable.prototype.concatWith = function (other) {
                var _ = this;
                return new Enumerable(function () {
                    var firstEnumerator;
                    var secondEnumerator;
                    return new EnumeratorBase(function () {
                        firstEnumerator = _.getEnumerator();
                    }, function (yielder) {
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
                    }, function () {
                        dispose(firstEnumerator, secondEnumerator);
                    });
                });
            };
            Enumerable.prototype.merge = function (enumerables) {
                var _ = this;
                if (!enumerables.length)
                    return _;
                if (enumerables.length == 1)
                    return _.concatWith(enumerables[0]);
                return new Enumerable(function () {
                    var enumerator;
                    var queue;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        queue = new Queue(enumerables);
                    }, function (yielder) {
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
                    }, function () {
                        dispose(enumerator, queue);
                    });
                });
            };
            Enumerable.prototype.concat = function () {
                var enumerables = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    enumerables[_i - 0] = arguments[_i];
                }
                var _ = this;
                if (enumerables.length == 0)
                    return _;
                if (enumerables.length == 1)
                    return _.concatWith(enumerables[0]);
                return _.merge(enumerables);
            };
            Enumerable.prototype.insertAt = function (index, other) {
                if (isNaN(index) || index < 0 || !isFinite(index))
                    throw new Error("'index' is invalid or out of bounds.");
                assertInteger(index, "index");
                var n = index | 0;
                var _ = this;
                _.throwIfDisposed();
                return new Enumerable(function () {
                    var firstEnumerator;
                    var secondEnumerator;
                    var count = INT_0;
                    var isEnumerated = false;
                    return new EnumeratorBase(function () {
                        count = INT_0;
                        firstEnumerator = _.getEnumerator();
                        secondEnumerator = enumeratorFrom(other);
                        isEnumerated = false;
                    }, function (yielder) {
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
                    }, function () {
                        dispose(firstEnumerator, secondEnumerator);
                    });
                });
            };
            Enumerable.prototype.alternateMultiple = function (sequence) {
                var _ = this;
                return new Enumerable(function () {
                    var buffer, mode, enumerator, alternateEnumerator;
                    return new EnumeratorBase(function () {
                        alternateEnumerator = new ArrayEnumerator(Enumerable.toArray(sequence));
                        enumerator = _.getEnumerator();
                        var hasAtLeastOne = enumerator.moveNext();
                        mode = hasAtLeastOne
                            ? 1
                            : 0;
                        if (hasAtLeastOne)
                            buffer = enumerator.current;
                    }, function (yielder) {
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
                    }, function () {
                        dispose(enumerator, alternateEnumerator);
                    });
                });
            };
            Enumerable.prototype.alternateSingle = function (value) {
                return this.alternateMultiple(Enumerable.make(value));
            };
            Enumerable.prototype.alternate = function () {
                var sequence = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    sequence[_i - 0] = arguments[_i];
                }
                return this.alternateMultiple(sequence);
            };
            Enumerable.prototype.intersect = function (second, compareSelector) {
                var _ = this;
                return new Enumerable(function () {
                    var enumerator;
                    var keys;
                    var outs;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        keys = new Dictionary(compareSelector);
                        outs = new Dictionary(compareSelector);
                        Enumerable.from(second)
                            .forEach(function (key) {
                            keys.addByKeyValue(key, true);
                        });
                    }, function (yielder) {
                        while (enumerator.moveNext()) {
                            var current = enumerator.current;
                            if (!outs.containsKey(current) && keys.containsKey(current)) {
                                outs.addByKeyValue(current, true);
                                return yielder.yieldReturn(current);
                            }
                        }
                        return yielder.yieldBreak();
                    }, function () {
                        dispose(enumerator);
                    });
                });
            };
            Enumerable.prototype.sequenceEqual = function (second, equalityComparer) {
                if (equalityComparer === void 0) { equalityComparer = Values.areEqual; }
                return using(this.getEnumerator(), function (e1) { return using(Enumerable.from(second).getEnumerator(), function (e2) {
                    while (e1.moveNext()) {
                        if (!e2.moveNext() || !equalityComparer(e1.current, e2.current))
                            return false;
                    }
                    return !e2.moveNext();
                }); });
            };
            Enumerable.prototype.union = function (second, compareSelector) {
                if (compareSelector === void 0) { compareSelector = Functions.Identity; }
                var source = this;
                return new Enumerable(function () {
                    var firstEnumerator;
                    var secondEnumerator;
                    var keys;
                    return new EnumeratorBase(function () {
                        firstEnumerator = source.getEnumerator();
                        keys = new Dictionary(compareSelector);
                    }, function (yielder) {
                        var current;
                        if (secondEnumerator === undefined) {
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
                    }, function () {
                        dispose(firstEnumerator, secondEnumerator);
                    });
                });
            };
            Enumerable.prototype.orderBy = function (keySelector) {
                if (keySelector === void 0) { keySelector = Functions.Identity; }
                return new OrderedEnumerable(this, keySelector, false);
            };
            Enumerable.prototype.orderByDescending = function (keySelector) {
                if (keySelector === void 0) { keySelector = Functions.Identity; }
                return new OrderedEnumerable(this, keySelector, true);
            };
            Enumerable.prototype.groupBy = function (keySelector, elementSelector, compareSelector) {
                if (elementSelector === void 0) { elementSelector = Functions.Identity; }
                var _ = this;
                return new Enumerable(function () { return _.toLookup(keySelector, elementSelector, compareSelector)
                    .getEnumerator(); });
            };
            Enumerable.prototype.partitionBy = function (keySelector, elementSelector, resultSelector, compareSelector) {
                if (elementSelector === void 0) { elementSelector = Functions.Identity; }
                if (resultSelector === void 0) { resultSelector = function (key, elements) { return new Grouping(key, elements); }; }
                if (compareSelector === void 0) { compareSelector = Functions.Identity; }
                var _ = this;
                return new Enumerable(function () {
                    var enumerator;
                    var key;
                    var compareKey;
                    var group;
                    var len;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        if (enumerator.moveNext()) {
                            key = keySelector(enumerator.current);
                            compareKey = compareSelector(key);
                            group = [elementSelector(enumerator.current)];
                            len = 1;
                        }
                        else
                            group = null;
                    }, function (yielder) {
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
                    }, function () {
                        dispose(enumerator);
                        group = null;
                    });
                });
            };
            Enumerable.prototype.buffer = function (size) {
                if (size < 1 || !isFinite(size))
                    throw new Error("Invalid buffer size.");
                assertInteger(size, "size");
                var _ = this, len;
                return new Enumerable(function () {
                    var enumerator;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        var array = ArrayUtility.initialize(size);
                        len = 0;
                        while (len < size && enumerator.moveNext) {
                            array[len++] = enumerator.current;
                        }
                        array.length = len;
                        return len && yielder.yieldReturn(array);
                    }, function () {
                        dispose(enumerator);
                    });
                });
            };
            Enumerable.prototype.aggregate = function (func, seed) {
                return this.scan(func, seed).lastOrDefault();
            };
            Enumerable.prototype.average = function (selector) {
                if (selector === void 0) { selector = numberOrNaN; }
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
            };
            Enumerable.prototype.max = function () {
                return this.aggregate(Functions.Greater);
            };
            Enumerable.prototype.min = function () {
                return this.aggregate(Functions.Lesser);
            };
            Enumerable.prototype.maxBy = function (keySelector) {
                if (keySelector === void 0) { keySelector = Functions.Identity; }
                return this.aggregate(function (a, b) { return (keySelector(a) > keySelector(b)) ? a : b; });
            };
            Enumerable.prototype.minBy = function (keySelector) {
                if (keySelector === void 0) { keySelector = Functions.Identity; }
                return this.aggregate(function (a, b) { return (keySelector(a) < keySelector(b)) ? a : b; });
            };
            Enumerable.prototype.sum = function (selector) {
                if (selector === void 0) { selector = numberOrNaN; }
                var sum = 0;
                var sumInfinite = 0;
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
                });
                return isNaN(sum) ? NaN : (sumInfinite ? (sumInfinite * Infinity) : sum);
            };
            Enumerable.prototype.product = function (selector) {
                if (selector === void 0) { selector = numberOrNaN; }
                var result = 1, exists = false;
                this.forEach(function (x) {
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
            };
            Enumerable.prototype.elementAt = function (index) {
                if (isNaN(index) || index < 0 || !isFinite(index))
                    throw new Error("'index' is invalid or out of bounds.");
                assertInteger(index, "index");
                var n = index | 0;
                var _ = this;
                _.throwIfDisposed();
                var value = undefined;
                var found = false;
                _.forEach(function (x, i) {
                    if (i == n) {
                        value = x;
                        found = true;
                        return false;
                    }
                });
                if (!found)
                    throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
                return value;
            };
            Enumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                if (isNaN(index) || index < 0 || !isFinite(index))
                    throw new Error("'index' is invalid or out of bounds.");
                assertInteger(index, "index");
                var n = index | 0;
                var _ = this;
                _.throwIfDisposed();
                var value = undefined;
                var found = false;
                _.forEach(function (x, i) {
                    if (i == n) {
                        value = x;
                        found = true;
                        return false;
                    }
                });
                return (!found) ? defaultValue : value;
            };
            Enumerable.prototype.first = function () {
                var _ = this;
                _.throwIfDisposed();
                var value = undefined;
                var found = false;
                _.forEach(function (x) {
                    value = x;
                    found = true;
                    return false;
                });
                if (!found)
                    throw new Error("first:No element satisfies the condition.");
                return value;
            };
            Enumerable.prototype.firstOrDefault = function (defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var _ = this;
                _.throwIfDisposed();
                var value = undefined;
                var found = false;
                _.forEach(function (x) {
                    value = x;
                    found = true;
                    return false;
                });
                return (!found) ? defaultValue : value;
            };
            Enumerable.prototype.last = function () {
                var _ = this;
                _.throwIfDisposed();
                var value = undefined;
                var found = false;
                _.forEach(function (x) {
                    found = true;
                    value = x;
                });
                if (!found)
                    throw new Error("last:No element satisfies the condition.");
                return value;
            };
            Enumerable.prototype.lastOrDefault = function (defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var _ = this;
                _.throwIfDisposed();
                var value = undefined;
                var found = false;
                _.forEach(function (x) {
                    found = true;
                    value = x;
                });
                return (!found) ? defaultValue : value;
            };
            Enumerable.prototype.single = function () {
                var _ = this;
                _.throwIfDisposed();
                var value = undefined;
                var found = false;
                _.forEach(function (x) {
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
            };
            Enumerable.prototype.singleOrDefault = function (defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var _ = this;
                _.throwIfDisposed();
                var value = undefined;
                var found = false;
                _.forEach(function (x) {
                    if (!found) {
                        found = true;
                        value = x;
                    }
                    else
                        throw new Error("single:sequence contains more than one element.");
                });
                return (!found) ? defaultValue : value;
            };
            Enumerable.prototype.share = function () {
                var _ = this;
                _.throwIfDisposed();
                var sharedEnumerator;
                return new Enumerable(function () {
                    return new EnumeratorBase(function () {
                        // assertIsNotDisposed(disposed);  This doesn't need an assertion since disposing the underlying enumerable disposes the enumerator.
                        if (!sharedEnumerator)
                            sharedEnumerator = _.getEnumerator();
                    }, function (yielder) {
                        return sharedEnumerator.moveNext()
                            && yielder.yieldReturn(sharedEnumerator.current);
                    });
                }, function () {
                    dispose(sharedEnumerator);
                });
            };
            Enumerable.prototype.memoize = function () {
                var _ = this, disposed = !_.throwIfDisposed();
                var cache;
                var enumerator;
                return new Enumerable(function () {
                    var index = INT_0;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        if (!enumerator)
                            enumerator = _.getEnumerator();
                        if (!cache)
                            cache = [];
                        index = INT_0;
                    }, function (yielder) {
                        throwIfDisposed(disposed);
                        var i = index++;
                        if (i >= cache.length) {
                            return (enumerator.moveNext())
                                ? yielder.yieldReturn(cache[i] = enumerator.current)
                                : false;
                        }
                        return yielder.yieldReturn(cache[i]);
                    });
                }, function () {
                    disposed = true;
                    if (cache)
                        cache.length = 0;
                    cache = null;
                    dispose(enumerator);
                    enumerator = null;
                });
            };
            Enumerable.prototype.catchError = function (handler) {
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var enumerator;
                    return new EnumeratorBase(function () {
                        try {
                            throwIfDisposed(disposed);
                            enumerator = _.getEnumerator();
                        }
                        catch (e) {
                        }
                    }, function (yielder) {
                        try {
                            throwIfDisposed(disposed);
                            if (enumerator.moveNext())
                                return yielder.yieldReturn(enumerator.current);
                        }
                        catch (e) {
                            handler(e);
                        }
                        return false;
                    }, function () {
                        dispose(enumerator);
                    });
                });
            };
            Enumerable.prototype.finallyAction = function (action) {
                var _ = this, disposed = !_.throwIfDisposed();
                return new Enumerable(function () {
                    var enumerator;
                    return new EnumeratorBase(function () {
                        throwIfDisposed(disposed);
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        throwIfDisposed(disposed);
                        return (enumerator.moveNext())
                            ? yielder.yieldReturn(enumerator.current)
                            : false;
                    }, function () {
                        try {
                            dispose(enumerator);
                        }
                        finally {
                            action();
                        }
                    });
                });
            };
            return Enumerable;
        })(DisposableBase);
        Linq.Enumerable = Enumerable;
        var ArrayEnumerable = (function (_super) {
            __extends(ArrayEnumerable, _super);
            function ArrayEnumerable(source) {
                var _ = this;
                _._disposableObjectName = "ArrayEnumerable";
                _._source = source;
                _super.call(this, function () {
                    _.throwIfDisposed();
                    return new ArrayEnumerator(function () {
                        _.throwIfDisposed("The underlying ArrayEnumerable was disposed.", "ArrayEnumerator");
                        return _._source;
                    });
                });
            }
            ArrayEnumerable.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this._source = null;
            };
            Object.defineProperty(ArrayEnumerable.prototype, "source", {
                get: function () {
                    return this._source;
                },
                enumerable: true,
                configurable: true
            });
            ArrayEnumerable.prototype.toArray = function () {
                var s = this.source;
                if (!s)
                    return [];
                if (s instanceof Array)
                    return s.slice();
                var len = s.length, result = new Array(len);
                for (var i = INT_0; i < len; ++i) {
                    result[i] = s[i];
                }
                return result;
            };
            ArrayEnumerable.prototype.asEnumerable = function () {
                return new ArrayEnumerable(this._source);
            };
            ArrayEnumerable.prototype.forEach = function (action) {
                var _ = this;
                _.throwIfDisposed();
                var source = _._source;
                if (source) {
                    for (var i = INT_0; i < source.length; ++i) {
                        if (action(source[i], i) === false)
                            break;
                    }
                }
            };
            ArrayEnumerable.prototype.any = function (predicate) {
                var _ = this;
                _.throwIfDisposed();
                var source = _._source, len = source ? source.length : 0;
                return len && (!predicate || _super.prototype.any.call(this, predicate));
            };
            ArrayEnumerable.prototype.count = function (predicate) {
                var _ = this;
                _.throwIfDisposed();
                var source = _._source, len = source ? source.length : 0;
                return len && (predicate ? _super.prototype.count.call(this, predicate) : len);
            };
            ArrayEnumerable.prototype.elementAt = function (index) {
                var _ = this;
                _.throwIfDisposed();
                var source = _._source;
                return (index < source.length && index >= 0)
                    ? source[index]
                    : _super.prototype.elementAt.call(this, index);
            };
            ArrayEnumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var _ = this;
                _.throwIfDisposed();
                var source = _._source;
                return (index < source.length && index >= 0)
                    ? source[index]
                    : defaultValue;
            };
            ArrayEnumerable.prototype.first = function () {
                var _ = this;
                _.throwIfDisposed();
                var source = _._source;
                return (source && source.length)
                    ? source[0]
                    : _super.prototype.first.call(this);
            };
            ArrayEnumerable.prototype.firstOrDefault = function (defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var _ = this;
                _.throwIfDisposed();
                var source = _._source;
                return (source && source.length)
                    ? source[0]
                    : defaultValue;
            };
            ArrayEnumerable.prototype.last = function () {
                var _ = this;
                _.throwIfDisposed();
                var source = _._source, len = source.length;
                return (len)
                    ? source[len - 1]
                    : _super.prototype.last.call(this);
            };
            ArrayEnumerable.prototype.lastOrDefault = function (defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                var _ = this;
                _.throwIfDisposed();
                var source = _._source, len = source.length;
                return len
                    ? source[len - 1]
                    : defaultValue;
            };
            ArrayEnumerable.prototype.skip = function (count) {
                var _ = this;
                if (!count || count < 0)
                    return _.asEnumerable();
                return new Enumerable(function () { return new ArrayEnumerator(function () { return _._source; }, count); });
            };
            ArrayEnumerable.prototype.takeExceptLast = function (count) {
                if (count === void 0) { count = 1; }
                var _ = this, len = _._source ? _._source.length : 0;
                return _.take(len - count);
            };
            ArrayEnumerable.prototype.takeFromLast = function (count) {
                if (!count || count < 0)
                    return Enumerable.empty();
                var _ = this, len = _._source
                    ? _._source.length
                    : 0;
                return _.skip(len - count);
            };
            ArrayEnumerable.prototype.reverse = function () {
                var _ = this;
                return new Enumerable(function () { return new ArrayEnumerator(function () { return _._source; }, _._source
                    ? (_._source.length - 1)
                    : 0, -1); });
            };
            ArrayEnumerable.prototype.memoize = function () {
                return new ArrayEnumerable(this._source);
            };
            ArrayEnumerable.prototype.sequenceEqual = function (second, equalityComparer) {
                if (equalityComparer === void 0) { equalityComparer = Values.areEqual; }
                if (second instanceof Array)
                    return ArrayCompare.areEqual(this.source, second, true, equalityComparer);
                if (second instanceof ArrayEnumerable)
                    return second.sequenceEqual(this.source, equalityComparer);
                return _super.prototype.sequenceEqual.call(this, second, equalityComparer);
            };
            ArrayEnumerable.prototype.toJoinedString = function (separator, selector) {
                if (separator === void 0) { separator = ""; }
                if (selector === void 0) { selector = Functions.Identity; }
                var s = this._source;
                return !selector && s instanceof Array
                    ? s.join(separator)
                    : _super.prototype.toJoinedString.call(this, separator, selector);
            };
            return ArrayEnumerable;
        })(Enumerable);
        var Grouping = (function (_super) {
            __extends(Grouping, _super);
            function Grouping(_groupKey, elements) {
                _super.call(this, elements);
                this._groupKey = _groupKey;
            }
            Object.defineProperty(Grouping.prototype, "key", {
                get: function () {
                    return this._groupKey;
                },
                enumerable: true,
                configurable: true
            });
            return Grouping;
        })(ArrayEnumerable);
        var Lookup = (function () {
            function Lookup(_dictionary) {
                this._dictionary = _dictionary;
            }
            Object.defineProperty(Lookup.prototype, "count", {
                get: function () {
                    return this._dictionary.count;
                },
                enumerable: true,
                configurable: true
            });
            Lookup.prototype.get = function (key) {
                return this._dictionary.getValue(key);
            };
            Lookup.prototype.contains = function (key) {
                return this._dictionary.containsKey(key);
            };
            Lookup.prototype.getEnumerator = function () {
                var _ = this;
                var enumerator;
                return new EnumeratorBase(function () {
                    enumerator = _._dictionary.getEnumerator();
                }, function (yielder) {
                    if (!enumerator.moveNext())
                        return false;
                    var current = enumerator.current;
                    return yielder.yieldReturn(new Grouping(current.key, current.value));
                }, function () {
                    dispose(enumerator);
                });
            };
            return Lookup;
        })();
        var WhereEnumerable = (function (_super) {
            __extends(WhereEnumerable, _super);
            function WhereEnumerable(prevSource, prevPredicate) {
                _super.call(this, null);
                this.prevSource = prevSource;
                this.prevPredicate = prevPredicate;
            }
            WhereEnumerable.prototype.where = function (predicate) {
                if (predicate.length > 1)
                    return _super.prototype.where.call(this, predicate);
                var prevPredicate = this.prevPredicate;
                var composedPredicate = function (x) { return prevPredicate(x) && predicate(x); };
                return new WhereEnumerable(this.prevSource, composedPredicate);
            };
            WhereEnumerable.prototype.select = function (selector) {
                if (selector.length > 1)
                    return _super.prototype.select.call(this, selector);
                return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector);
            };
            WhereEnumerable.prototype.getEnumerator = function () {
                var predicate = this.prevPredicate;
                var source = this.prevSource;
                var enumerator;
                return new EnumeratorBase(function () {
                    enumerator = source.getEnumerator();
                }, function (yielder) {
                    while (enumerator.moveNext()) {
                        if (predicate(enumerator.current))
                            return yielder.yieldReturn(enumerator.current);
                    }
                    return false;
                }, function () {
                    dispose(enumerator);
                });
            };
            WhereEnumerable.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this.prevPredicate = null;
                this.prevSource = null;
            };
            return WhereEnumerable;
        })(Enumerable);
        var WhereSelectEnumerable = (function (_super) {
            __extends(WhereSelectEnumerable, _super);
            function WhereSelectEnumerable(prevSource, prevPredicate, prevSelector) {
                _super.call(this, null);
                this.prevSource = prevSource;
                this.prevPredicate = prevPredicate;
                this.prevSelector = prevSelector;
            }
            WhereSelectEnumerable.prototype.where = function (predicate) {
                if (predicate.length > 1)
                    return _super.prototype.where.call(this, predicate);
                return new WhereEnumerable(this, predicate);
            };
            WhereSelectEnumerable.prototype.select = function (selector) {
                if (selector.length > 1)
                    return _super.prototype.select.call(this, selector);
                var _ = this;
                var prevSelector = _.prevSelector;
                var composedSelector = function (x) { return selector(prevSelector(x)); };
                return new WhereSelectEnumerable(_.prevSource, _.prevPredicate, composedSelector);
            };
            WhereSelectEnumerable.prototype.getEnumerator = function () {
                var _ = this, predicate = _.prevPredicate, source = _.prevSource, selector = _.prevSelector, enumerator;
                return new EnumeratorBase(function () {
                    enumerator = source.getEnumerator();
                }, function (yielder) {
                    while (enumerator.moveNext()) {
                        var c = enumerator.current;
                        if (predicate == null || predicate(c)) {
                            return yielder.yieldReturn(selector(c));
                        }
                    }
                    return false;
                }, function () {
                    dispose(enumerator);
                });
            };
            WhereSelectEnumerable.prototype._onDispose = function () {
                var _ = this;
                _super.prototype._onDispose.call(this);
                _.prevPredicate = null;
                _.prevSource = null;
                _.prevSelector = null;
            };
            return WhereSelectEnumerable;
        })(Enumerable);
        var OrderedEnumerable = (function (_super) {
            __extends(OrderedEnumerable, _super);
            function OrderedEnumerable(source, keySelector, descending, parent) {
                _super.call(this, null);
                this.source = source;
                this.keySelector = keySelector;
                this.descending = descending;
                this.parent = parent;
            }
            OrderedEnumerable.prototype.createOrderedEnumerable = function (keySelector, descending) {
                return new OrderedEnumerable(this.source, keySelector, descending, this);
            };
            OrderedEnumerable.prototype.thenBy = function (keySelector) {
                return this.createOrderedEnumerable(keySelector, false);
            };
            OrderedEnumerable.prototype.thenByDescending = function (keySelector) {
                return this.createOrderedEnumerable(keySelector, true);
            };
            OrderedEnumerable.prototype.getEnumerator = function () {
                var _ = this;
                var buffer;
                var indexes;
                var index = INT_0;
                return new EnumeratorBase(function () {
                    index = INT_0;
                    buffer = [];
                    indexes = [];
                    Enumerable.forEach(_.source, function (item, i) {
                        buffer[i] = item;
                        indexes[i] = i;
                    });
                    var sortContext = SortContext.create(_);
                    sortContext.generateKeys(buffer);
                    indexes.sort(function (a, b) { return sortContext.compare(a, b); });
                }, function (yielder) {
                    return (index < indexes.length)
                        ? yielder.yieldReturn(buffer[indexes[index++]])
                        : false;
                }, function () {
                    if (buffer)
                        buffer.length = 0;
                    buffer = null;
                    if (indexes)
                        indexes.length = 0;
                    indexes = null;
                });
            };
            OrderedEnumerable.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this.source = null;
                this.keySelector = null;
                this.descending = null;
                this.parent = null;
            };
            return OrderedEnumerable;
        })(Enumerable);
        var SortContext = (function () {
            function SortContext(keySelector, descending, child) {
                this.keySelector = keySelector;
                this.descending = descending;
                this.child = child;
                this.keys = null;
            }
            SortContext.create = function (orderedEnumerable, currentContext) {
                if (currentContext === void 0) { currentContext = null; }
                var context = new SortContext(orderedEnumerable.keySelector, orderedEnumerable.descending, currentContext);
                if (orderedEnumerable.parent)
                    return SortContext.create(orderedEnumerable.parent, context);
                return context;
            };
            SortContext.prototype.generateKeys = function (source) {
                var _ = this;
                var len = source.length | 0;
                var keySelector = _.keySelector;
                var keys = new Array(len);
                for (var i = INT_0; i < len; ++i) {
                    keys[i] = keySelector(source[i]);
                }
                _.keys = keys;
                if (_.child)
                    _.child.generateKeys(source);
            };
            SortContext.prototype.compare = function (index1, index2) {
                var _ = this, keys = _.keys;
                var comparison = Values.compare(keys[index1], keys[index2]);
                if (comparison == 0) {
                    var child = _.child;
                    return child
                        ? child.compare(index1, index2)
                        : Values.compare(index1, index2);
                }
                return _.descending ? -comparison : comparison;
            };
            return SortContext;
        })();
    })(Linq || (Linq = {}));
    function throwIfDisposed(disposed) {
        if (disposed)
            throw new ObjectDisposedException("Enumerable");
    }
    function numberOrNaN(value) {
        return isNaN(value) ? NaN : value;
    }
    function assertInteger(value, variable) {
        if (typeof value === Types.Number && !isNaN(value) && value != (value | 0))
            throw new Error("'" + variable + "'" + " must be an integer.");
        return true;
    }
    return Linq;
});
//# sourceMappingURL=Linq.js.map