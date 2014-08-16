var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var System;
(function (System) {
    (function (Linq) {
        "use strict";

        var ArrayUtility = System.Collections.ArrayUtility;

        var EnumeratorBase = System.Collections.EnumeratorBase;

        var Dictionary = System.Collections.Dictionary;

        var using = System.using;

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
        })(System.Functions);

        var Functions = new LinqFunctions();

        var Types = new System.Types();

        function assertIsNotDisposed(disposed) {
            return System.DisposableBase.assertIsNotDisposed(disposed, "Enumerable was disposed.");
        }

        function numberOrNaN(value) {
            return isNaN(value) ? NaN : value;
        }

        (function (EnumerableAction) {
            EnumerableAction[EnumerableAction["Break"] = 0] = "Break";
            EnumerableAction[EnumerableAction["Return"] = 1] = "Return";
            EnumerableAction[EnumerableAction["Skip"] = 2] = "Skip";
        })(Linq.EnumerableAction || (Linq.EnumerableAction = {}));
        var EnumerableAction = Linq.EnumerableAction;

        var Enumerable = (function (_super) {
            __extends(Enumerable, _super);
            function Enumerable(enumeratorFactory, finalizer) {
                _super.call(this, finalizer);
                this.enumeratorFactory = enumeratorFactory;
            }
            Enumerable.fromArray = function (array) {
                return new ArrayEnumerable(array);
            };

            Enumerable.from = function (source) {
                if ("getEnumerator" in source)
                    return source;

                if (source instanceof Array || typeof source == System.Types.Object && "length" in source)
                    return Enumerable.fromArray(source);

                throw new Error("Unsupported enumerable.");
            };

            Enumerable.prototype.getEnumerator = function () {
                this.assertIsNotDisposed();

                return this.enumeratorFactory();
            };

            Enumerable.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this.enumeratorFactory = null;
            };

            Enumerable.choice = function (values) {
                return new Enumerable(function () {
                    return new EnumeratorBase(null, function (yielder) {
                        return yielder.yieldReturn(values[(Math.random() * values.length) | 0]);
                    });
                });
            };

            Enumerable.cycle = function (values) {
                return new Enumerable(function () {
                    var index;
                    return new EnumeratorBase(function () {
                        index = 0;
                    }, function (yielder) {
                        if (index >= values.length)
                            index = 0;
                        return yielder.yieldReturn(values[index++]);
                    });
                });
            };

            Enumerable.empty = function () {
                return new Enumerable(function () {
                    return new EnumeratorBase(null, Functions.False);
                });
            };

            Enumerable.repeat = function (element, count) {
                if (typeof count === "undefined") { count = Infinity; }
                if (isNaN(count) || count <= 0)
                    return Enumerable.empty();

                return new Enumerable(function () {
                    var index;

                    return new EnumeratorBase(function () {
                        index = 0;
                    }, function (yielder) {
                        return (index++ < count) ? yielder.yieldReturn(element) : false;
                    });
                });
            };

            Enumerable.repeatWithFinalize = function (initializer, finalizer) {
                return new Enumerable(function () {
                    var element;
                    return new EnumeratorBase(function () {
                        element = initializer();
                    }, function (yielder) {
                        return yielder.yieldReturn(element);
                    }, function () {
                        finalizer(element);
                    });
                });
            };

            Enumerable.make = function (element) {
                return Enumerable.repeat(element, 1);
            };

            Enumerable.range = function (start, count, step) {
                if (!count)
                    return Enumerable.empty();

                if (!step)
                    step = 1;

                return new Enumerable(function () {
                    var value;
                    var index;

                    return new EnumeratorBase(function () {
                        index = 0;
                        value = start - step;
                    }, function (yielder) {
                        return (index++ < count) ? yielder.yieldReturn(value += step) : yielder.yieldBreak();
                    });
                });
            };

            Enumerable.rangeDown = function (start, count, step) {
                if (!step)
                    step = -1;
                else
                    step *= -1;

                return Enumerable.range(start, count, step);
            };

            Enumerable.toInfinity = function (start, step) {
                return Enumerable.rangeTo(start, Infinity, step);
            };

            Enumerable.toNegativeInfinity = function (start, step) {
                return Enumerable.rangeTo(start, -Infinity, step);
            };

            Enumerable.rangeTo = function (start, to, step) {
                if (!start)
                    start = 0;
                if (!step)
                    step = 1;
                step = Math.abs(step);

                return new Enumerable(function () {
                    var value;

                    return start < to ? new EnumeratorBase(function () {
                        value = start - step;
                    }, function (yielder) {
                        var next = value += step;
                        return (next <= to) ? yielder.yieldReturn(next) : yielder.yieldBreak();
                    }) : new EnumeratorBase(function () {
                        value = start + step;
                    }, function (yielder) {
                        var next = value -= step;
                        return (next >= to) ? yielder.yieldReturn(next) : yielder.yieldBreak();
                    });
                });
            };

            Enumerable.matches = function (input, pattern, flags) {
                if (typeof flags === "undefined") { flags = ""; }
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

                var len = input.length;

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
                if (typeof count == Types.Number && (count <= 0 || isNaN(count)))
                    return Enumerable.empty();

                if (!count)
                    count = Infinity;

                return new Enumerable(function () {
                    var index;

                    return new EnumeratorBase(function () {
                        index = 0;
                    }, function (yielder) {
                        var current = index++;
                        return (current < count) ? yielder.yieldReturn(factory(current)) : false;
                    });
                });
            };

            Enumerable.unfold = function (seed, valueFactory) {
                return new Enumerable(function () {
                    var index;
                    var value;
                    return new EnumeratorBase(function () {
                        index = 0;
                        value = seed;
                    }, function (yielder) {
                        value = valueFactory(value, index++);
                        return yielder.yieldReturn(value);
                    });
                });
            };

            Enumerable.defer = function (enumerableFactory) {
                return new Enumerable(function () {
                    var enumerator;

                    return new EnumeratorBase(function () {
                        enumerator = enumerableFactory().getEnumerator();
                    }, function (yielder) {
                        return (enumerator.moveNext()) ? yielder.yieldReturn(enumerator.current) : yielder.yieldBreak();
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.forEach = function (enumerable, action) {
                var _ = enumerable;

                var index = 0;

                using(_.getEnumerator(), function (e) {
                    while (e.moveNext() && action(e.current, index++) !== false) {
                    }
                });
            };

            Enumerable.prototype.assertIsNotDisposed = function (errorMessage) {
                if (typeof errorMessage === "undefined") { errorMessage = "Enumerable was disposed."; }
                return _super.prototype.assertIsNotDisposed.call(this, errorMessage);
            };

            Enumerable.prototype.forEach = function (action) {
                var _ = this;
                _.assertIsNotDisposed();

                var index = 0;

                using(_.getEnumerator(), function (e) {
                    while (_.assertIsNotDisposed() && e.moveNext() && action(e.current, index++) !== false) {
                    }
                });
            };

            Enumerable.prototype.toArray = function (predicate) {
                var result = [];

                if (predicate)
                    return this.where(predicate).toArray();

                this.forEach(function (x) {
                    return result.push(x);
                });

                return result;
            };

            Enumerable.prototype.asEnumerable = function () {
                var _ = this;
                return new Enumerable(function () {
                    return _.getEnumerator();
                });
            };

            Enumerable.prototype.toLookup = function (keySelector, elementSelector, compareSelector) {
                if (typeof elementSelector === "undefined") { elementSelector = Functions.Identity; }
                if (typeof compareSelector === "undefined") { compareSelector = Functions.Identity; }
                var dict = new Dictionary(compareSelector);
                this.forEach(function (x) {
                    var key = keySelector(x);
                    var element = elementSelector(x);

                    var array = dict.get(key);
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
                if (typeof compareSelector === "undefined") { compareSelector = Functions.Identity; }
                var dict = new Dictionary(compareSelector);
                this.forEach(function (x) {
                    return dict.addByKeyValue(keySelector(x), elementSelector(x));
                });
                return dict;
            };

            Enumerable.prototype.toJoinedString = function (separator, selector) {
                if (typeof separator === "undefined") { separator = ""; }
                if (typeof selector === "undefined") { selector = Functions.Identity; }
                return this.select(selector).toArray().join(separator);
            };

            Enumerable.prototype.doAction = function (action) {
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var enumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);

                        index = 0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);

                        while (enumerator.moveNext()) {
                            var actionResult = action(enumerator.current, index++);

                            if (actionResult === false || actionResult === EnumerableAction)
                                return yielder.yieldBreak();

                            if (actionResult !== 2)
                                return yielder.yieldReturn(enumerator.current);
                        }
                        return false;
                    }, function () {
                        enumerator.dispose();
                    });
                }, function () {
                    disposed = true;
                });
            };

            Enumerable.prototype.force = function (defaultAction) {
                if (typeof defaultAction === "undefined") { defaultAction = 0 /* Break */; }
                this.assertIsNotDisposed();

                this.doAction(function (element) {
                    return defaultAction;
                });
            };

            Enumerable.prototype.skip = function (count) {
                this.assertIsNotDisposed();

                return (!count || count < 0) ? this.asEnumerable() : this.doAction(function (element, index) {
                    return index < count ? 2 /* Skip */ : 1 /* Return */;
                });
            };

            Enumerable.prototype.skipWhile = function (predicate) {
                this.assertIsNotDisposed();

                var skipping = true;

                return this.doAction(function (element, index) {
                    if (skipping)
                        skipping = predicate(element, index);

                    return skipping ? 2 /* Skip */ : 1 /* Return */;
                });
            };

            Enumerable.prototype.take = function (count) {
                this.assertIsNotDisposed();

                return (!count || count < 0) ? Enumerable.empty() : this.doAction(function (element, index) {
                    return index < count;
                });
            };

            Enumerable.prototype.takeWhile = function (predicate) {
                this.assertIsNotDisposed();

                return this.doAction(function (element, index) {
                    return predicate(element, index) ? 1 /* Return */ : 0 /* Break */;
                });
            };

            Enumerable.prototype.takeExceptLast = function (count) {
                if (typeof count === "undefined") { count = 1; }
                var _ = this;

                return new Enumerable(function () {
                    if (count <= 0)
                        return _.getEnumerator();

                    var enumerator;
                    var q;

                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        q = [];
                    }, function (yielder) {
                        while (enumerator.moveNext()) {
                            q.push(enumerator.current);

                            if (q.length > count)
                                return yielder.yieldReturn(q.shift());
                        }
                        return false;
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.takeFromLast = function (count) {
                if (!count || count < 0)
                    return Enumerable.empty();
                var _ = this;

                return new Enumerable(function () {
                    var enumerator;

                    return new EnumeratorBase(function () {
                        var q = [];
                        using(_.getEnumerator(), function (e) {
                            while (e.moveNext()) {
                                if (q.length == count)
                                    q.shift();
                                q.push(e.current);
                            }
                        });
                        enumerator = Enumerable.fromArray(q).getEnumerator();
                    }, function (yielder) {
                        return enumerator.moveNext() && yielder.yieldReturn(enumerator.current);
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.traverseBreadthFirst = function (func, resultSelector) {
                var _ = this;

                return new Enumerable(function () {
                    var enumerator;
                    var nestLevel = 0;
                    var buffer = [];

                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        while (true) {
                            if (enumerator.moveNext()) {
                                buffer.push(enumerator.current);
                                return yielder.yieldReturn(resultSelector(enumerator.current, nestLevel));
                            }

                            var next = Enumerable.fromArray(buffer).selectMany(function (x) {
                                return func(x);
                            });
                            if (!next.any()) {
                                return false;
                            } else {
                                nestLevel++;
                                buffer = [];
                                enumerator.dispose();
                                enumerator = next.getEnumerator();
                            }
                        }
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.traverseDepthFirst = function (func, resultSelector) {
                var _ = this;

                return new Enumerable(function () {
                    var enumeratorStack = [];
                    var enumerator;

                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        while (true) {
                            if (enumerator.moveNext()) {
                                var value = resultSelector(enumerator.current, enumeratorStack.length);
                                enumeratorStack.push(enumerator);
                                enumerator = func(enumerator.current).getEnumerator();
                                return yielder.yieldReturn(value);
                            }

                            if (enumeratorStack.length == 0)
                                return false;

                            enumerator.dispose();
                            enumerator = enumeratorStack.pop();
                        }
                    }, function () {
                        try  {
                            enumerator.dispose();
                        } finally {
                            enumeratorStack.forEach(function (s) {
                                return s.dispose();
                            });
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
                                } else {
                                    middleEnumerator = null;
                                }
                            }

                            if (enumerator.moveNext()) {
                                var c = enumerator.current;
                                if (c instanceof Array) {
                                    middleEnumerator.dispose();
                                    middleEnumerator = Enumerable.fromArray(c).selectMany(Functions.Identity).flatten().getEnumerator();
                                    continue;
                                } else {
                                    return yielder.yieldReturn(enumerator.current);
                                }
                            }

                            return false;
                        }
                    }, function () {
                        try  {
                            enumerator.dispose();
                        } finally {
                            middleEnumerator.dispose();
                        }
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
                        return enumerator.moveNext() && yielder.yieldReturn(selector(prev, enumerator.current));
                    }, function () {
                        enumerator.dispose();
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
                            return isUseSeed ? yielder.yieldReturn(value = seed) : enumerator.moveNext() && yielder.yieldReturn(value = enumerator.current);
                        }

                        return (enumerator.moveNext()) ? yielder.yieldReturn(value = func(value, enumerator.current)) : false;
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.select = function (selector) {
                var _ = this, disposed = !_.assertIsNotDisposed();

                if (selector.length < 2)
                    return new WhereSelectEnumerable(_, null, selector);

                return new Enumerable(function () {
                    var enumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);

                        index = 0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);

                        return enumerator.moveNext() ? yielder.yieldReturn(selector(enumerator.current, index++)) : false;
                    }, function () {
                        enumerator.dispose();
                    });
                }, function () {
                    disposed = true;
                });
            };

            Enumerable.prototype.selectMany = function (collectionSelector, resultSelector) {
                var _ = this;
                if (!resultSelector)
                    resultSelector = function (a, b) {
                        return b;
                    };

                return new Enumerable(function () {
                    var enumerator;
                    var middleEnumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        middleEnumerator = undefined;
                        index = 0;
                    }, function (yielder) {
                        if (middleEnumerator === undefined && !enumerator.moveNext())
                            return false;

                        do {
                            if (!middleEnumerator) {
                                var middleSeq = collectionSelector(enumerator.current, index++);

                                if (!middleSeq)
                                    continue;

                                middleEnumerator = System.Collections.Enumerator.from(middleSeq);
                            }

                            if (middleEnumerator.moveNext())
                                return yielder.yieldReturn(resultSelector(enumerator.current, middleEnumerator.current));

                            middleEnumerator.dispose();
                            middleEnumerator = null;
                        } while(enumerator.moveNext());

                        return false;
                    }, function () {
                        try  {
                            enumerator.dispose();
                            enumerator = null;
                        } finally {
                            if (middleEnumerator)
                                middleEnumerator.dispose();
                            middleEnumerator = null;
                        }
                    });
                });
            };

            Enumerable.prototype.choose = function (selector) {
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var enumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);

                        index = 0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);

                        while (enumerator.moveNext()) {
                            var result = selector(enumerator.current, index++);
                            if (result !== null && result !== undefined)
                                return yielder.yieldReturn(result);
                        }

                        return false;
                    }, function () {
                        enumerator.dispose();
                    });
                }, function () {
                    disposed = true;
                });
            };

            Enumerable.prototype.where = function (predicate) {
                var _ = this, disposed = !_.assertIsNotDisposed();

                if (predicate.length < 2)
                    return new WhereEnumerable(_, predicate);

                return new Enumerable(function () {
                    var enumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);

                        index = 0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);

                        while (enumerator.moveNext()) {
                            if (predicate(enumerator.current, index++))
                                return yielder.yieldReturn(enumerator.current);
                        }
                        return false;
                    }, function () {
                        enumerator.dispose();
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
                return ((typeName === null) ? this.where(function (x) {
                    return x instanceof type;
                }) : this.where(function (x) {
                    return typeof x === typeName;
                }));
            };

            Enumerable.prototype.except = function (second, compareSelector) {
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var enumerator;
                    var keys;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);
                        enumerator = _.getEnumerator();
                        keys = new System.Collections.Dictionary(compareSelector);
                        if (second)
                            Enumerable.forEach(second, function (key) {
                                return keys.addByKeyValue(key, true);
                            });
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);
                        while (enumerator.moveNext()) {
                            var current = enumerator.current;
                            if (!keys.containsKey(current)) {
                                keys.addByKeyValue(current, true);
                                return yielder.yieldReturn(current);
                            }
                        }
                        return false;
                    }, function () {
                        enumerator.dispose();
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
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var enumerator;
                    var compareKey;
                    var initial = true;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);
                        while (enumerator.moveNext()) {
                            var key = compareSelector(enumerator.current);

                            if (initial) {
                                initial = false;
                            } else if (compareKey === key) {
                                continue;
                            }

                            compareKey = key;
                            return yielder.yieldReturn(enumerator.current);
                        }
                        return false;
                    }, function () {
                        enumerator.dispose();
                    });
                }, function () {
                    disposed = true;
                });
            };

            Enumerable.prototype.reverse = function () {
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var buffer;
                    var index;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);
                        buffer = _.toArray();
                        index = buffer.length;
                    }, function (yielder) {
                        return index > 0 && yielder.yieldReturn(buffer[--index]);
                    }, function () {
                        buffer.length = 0;
                    });
                }, function () {
                    disposed = true;
                });
            };

            Enumerable.prototype.shuffle = function () {
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var buffer;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);
                        buffer = _.toArray();
                    }, function (yielder) {
                        var len = buffer.length;
                        return len && yielder.yieldReturn(buffer.splice((Math.random() * len) | 0, 1 | 0).pop());
                    }, function () {
                        buffer.length = 0;
                    });
                }, function () {
                    disposed = true;
                });
            };

            Enumerable.prototype.count = function (predicate) {
                var _ = this;
                _.assertIsNotDisposed();

                var count = 0;
                if (predicate) {
                    _.forEach(function (x, i) {
                        if (predicate(x, i))
                            ++count;
                    });
                } else {
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
                } else {
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
                return compareSelector ? this.any(function (v) {
                    return compareSelector(v) === compareSelector(value);
                }) : this.any(function (v) {
                    return v === value;
                });
            };

            Enumerable.prototype.indexOf = function (value, compareSelector) {
                var found = -1;

                if (compareSelector)
                    this.forEach(function (element, i) {
                        if (System.areEqual(compareSelector(element), compareSelector(value), true)) {
                            found = i;
                            return false;
                        }
                    });
                else
                    this.forEach(function (element, i) {
                        if (System.areEqual(element, value, true)) {
                            found = i;
                            return false;
                        }
                    });

                return found;
            };

            Enumerable.prototype.lastIndexOf = function (value, compareSelector) {
                var result = -1;

                if (compareSelector)
                    this.forEach(function (element, i) {
                        if (System.areEqual(compareSelector(element), compareSelector(value), true))
                            result = i;
                    });
                else
                    this.forEach(function (element, i) {
                        if (System.areEqual(element, value, true))
                            result = i;
                    });

                return result;
            };

            Enumerable.prototype.defaultIfEmpty = function (defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var enumerator;
                    var isFirst;

                    return new EnumeratorBase(function () {
                        isFirst = true;
                        assertIsNotDisposed(disposed);
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);

                        if (enumerator.moveNext()) {
                            isFirst = false;
                            return yielder.yieldReturn(enumerator.current);
                        } else if (isFirst) {
                            isFirst = false;
                            return yielder.yieldReturn(defaultValue);
                        }
                        return false;
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.sequenceEqual = function (second, equalityComparer) {
                if (typeof equalityComparer === "undefined") { equalityComparer = System.areEqual; }
                return using(this.getEnumerator(), function (e1) {
                    return using(second.getEnumerator(), function (e2) {
                        while (e1.moveNext()) {
                            if (!e2.moveNext() || !equalityComparer(e1.current, e2.current))
                                return false;
                        }

                        return !e2.moveNext();
                    });
                });
            };

            Enumerable.prototype.union = function (second, compareSelector) {
                if (typeof compareSelector === "undefined") { compareSelector = Functions.Identity; }
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
                            secondEnumerator = "getEnumerator" in second ? second : Enumerable.fromArray(second).getEnumerator();
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
                        try  {
                            firstEnumerator.dispose();
                        } finally {
                            secondEnumerator.dispose();
                        }
                    });
                });
            };

            Enumerable.prototype.orderBy = function (keySelector) {
                if (typeof keySelector === "undefined") { keySelector = Functions.Identity; }
                return new OrderedEnumerable(this, keySelector, false);
            };

            Enumerable.prototype.orderByDescending = function (keySelector) {
                if (typeof keySelector === "undefined") { keySelector = Functions.Identity; }
                return new OrderedEnumerable(this, keySelector, true);
            };

            Enumerable.prototype.groupBy = function (keySelector, elementSelector, compareSelector) {
                if (typeof elementSelector === "undefined") { elementSelector = Functions.Identity; }
                var _ = this;
                return new Enumerable(function () {
                    return _.toLookup(keySelector, elementSelector, compareSelector).getEnumerator();
                });
            };

            Enumerable.prototype.partitionBy = function (keySelector, elementSelector, resultSelector, compareSelector) {
                if (typeof elementSelector === "undefined") { elementSelector = Functions.Identity; }
                if (typeof resultSelector === "undefined") { resultSelector = function (key, elements) {
                    return new Grouping(key, elements);
                }; }
                if (typeof compareSelector === "undefined") { compareSelector = Functions.Identity; }
                var _ = this;

                return new Enumerable(function () {
                    var enumerator;
                    var key;
                    var compareKey;
                    var group = [];

                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                        if (enumerator.moveNext()) {
                            key = keySelector(enumerator.current);
                            compareKey = compareSelector(key);
                            group.push(elementSelector(enumerator.current));
                        }
                    }, function (yielder) {
                        var hasNext;

                        while ((hasNext = enumerator.moveNext())) {
                            if (compareKey === compareSelector(keySelector(enumerator.current)))
                                group.push(elementSelector(enumerator.current));
                            else
                                break;
                        }

                        if (group.length > 0) {
                            var result = resultSelector(key, group);

                            if (hasNext) {
                                key = keySelector(enumerator.current);
                                compareKey = compareSelector(key);
                                group = [elementSelector(enumerator.current)];
                            } else
                                group = [];

                            return yielder.yieldReturn(result);
                        }

                        return false;
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.buffer = function (size) {
                if (size < 1)
                    throw new Error("Invalid buffer size.");
                var _ = this;

                return new Enumerable(function () {
                    var enumerator;
                    return new EnumeratorBase(function () {
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        var array = [];
                        while (array.length < size && enumerator.moveNext())
                            array.push(enumerator.current);

                        return array.length && yielder.yieldReturn(array);
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.aggregate = function (func, seed) {
                return this.scan(func, seed).lastOrDefault();
            };

            Enumerable.prototype.average = function (selector) {
                if (typeof selector === "undefined") { selector = numberOrNaN; }
                var sum = 0;
                var count = 0;

                this.forEach(function (x) {
                    var value = selector(x);
                    if (!isNaN(value)) {
                        sum = NaN;
                        return false;
                    }
                    sum += value;
                    ++count;
                });

                return (isNaN(sum) || !count) ? NaN : (sum / count);
            };

            Enumerable.prototype.max = function () {
                return this.aggregate(Functions.Greater);
            };

            Enumerable.prototype.min = function () {
                return this.aggregate(Functions.Lesser);
            };

            Enumerable.prototype.maxBy = function (keySelector) {
                if (typeof keySelector === "undefined") { keySelector = Functions.Identity; }
                return this.aggregate(function (a, b) {
                    return (keySelector(a) > keySelector(b)) ? a : b;
                });
            };

            Enumerable.prototype.minBy = function (keySelector) {
                if (typeof keySelector === "undefined") { keySelector = Functions.Identity; }
                return this.aggregate(function (a, b) {
                    return (keySelector(a) < keySelector(b)) ? a : b;
                });
            };

            Enumerable.prototype.sum = function (selector) {
                if (typeof selector === "undefined") { selector = numberOrNaN; }
                var sum = 0;

                this.forEach(function (x) {
                    var value = selector(x);
                    if (!isNaN(value)) {
                        sum = NaN;
                        return false;
                    }
                    sum += value;
                });

                return isNaN(sum) ? NaN : sum;
            };

            Enumerable.prototype.product = function (selector) {
                if (typeof selector === "undefined") { selector = numberOrNaN; }
                var result = 1, exists = false;

                this.forEach(function (x) {
                    exists = true;
                    var value = selector(x);
                    if (!isNaN(value)) {
                        result = NaN;
                        return false;
                    }
                    result *= value;
                });

                return (exists && isNaN(result)) ? NaN : result;
            };

            Enumerable.prototype.elementAt = function (index) {
                var _ = this;
                _.assertIsNotDisposed();

                var value;
                var found = false;
                _.forEach(function (x, i) {
                    if (i == index) {
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
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var value;
                var found = false;
                _.forEach(function (x, i) {
                    if (i == index) {
                        value = x;
                        found = true;
                        return false;
                    }
                });

                return (!found) ? defaultValue : value;
            };

            Enumerable.prototype.first = function () {
                var _ = this;
                _.assertIsNotDisposed();

                var value;
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
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var value;
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
                _.assertIsNotDisposed();

                var value;
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
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var value;
                var found = false;
                _.forEach(function (x) {
                    found = true;
                    value = x;
                });
                return (!found) ? defaultValue : value;
            };

            Enumerable.prototype.single = function () {
                var _ = this;
                _.assertIsNotDisposed();

                var value;
                var found = false;
                _.forEach(function (x) {
                    if (!found) {
                        found = true;
                        value = x;
                    } else
                        throw new Error("single:sequence contains more than one element.");
                });

                if (!found)
                    throw new Error("single:No element satisfies the condition.");
                return value;
            };

            Enumerable.prototype.singleOrDefault = function (defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var value;
                var found = false;
                _.forEach(function (x) {
                    if (!found) {
                        found = true;
                        value = x;
                    } else
                        throw new Error("single:sequence contains more than one element.");
                });

                return (!found) ? defaultValue : value;
            };

            Enumerable.prototype.share = function () {
                var _ = this;
                _.assertIsNotDisposed();

                var sharedEnumerator;
                return new Enumerable(function () {
                    return new EnumeratorBase(function () {
                        if (!sharedEnumerator)
                            sharedEnumerator = _.getEnumerator();
                    }, function (yielder) {
                        return sharedEnumerator.moveNext() && yielder.yieldReturn(sharedEnumerator.current);
                    });
                }, function () {
                    if (sharedEnumerator)
                        sharedEnumerator.dispose();
                });
            };

            Enumerable.prototype.memoize = function () {
                var _ = this, disposed = !_.assertIsNotDisposed();

                var cache;
                return new Enumerable(function () {
                    var enumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);

                        if (!enumerator)
                            enumerator = _.getEnumerator();
                        if (!cache)
                            cache = [];
                        index = -1;
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);

                        index++;

                        if (index >= cache.length) {
                            return (enumerator.moveNext()) ? yielder.yieldReturn(cache[index] = enumerator.current) : false;
                        }

                        return yielder.yieldReturn(cache[index]);
                    });
                }, function () {
                    disposed = true;
                    if (cache)
                        cache.length = 0;
                    cache = null;
                });
            };

            Enumerable.prototype.catchError = function (handler) {
                var _ = this, disposed = !_.assertIsNotDisposed();
                return new Enumerable(function () {
                    var enumerator;

                    return new EnumeratorBase(function () {
                        try  {
                            assertIsNotDisposed(disposed);
                            enumerator = _.getEnumerator();
                        } catch (e) {
                        }
                    }, function (yielder) {
                        try  {
                            assertIsNotDisposed(disposed);
                            if (enumerator.moveNext())
                                return yielder.yieldReturn(enumerator.current);
                        } catch (e) {
                            handler(e);
                        }
                        return false;
                    }, function () {
                        enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.finallyAction = function (action) {
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var enumerator;

                    return new EnumeratorBase(function () {
                        assertIsNotDisposed(disposed);
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        assertIsNotDisposed(disposed);
                        return (enumerator.moveNext()) ? yielder.yieldReturn(enumerator.current) : false;
                    }, function () {
                        try  {
                            enumerator.dispose();
                        } finally {
                            action();
                        }
                    });
                });
            };
            return Enumerable;
        })(System.DisposableBase);
        Linq.Enumerable = Enumerable;

        var ArrayEnumerable = (function (_super) {
            __extends(ArrayEnumerable, _super);
            function ArrayEnumerable(source) {
                var _ = this;
                _._source = source;
                _super.call(this, function () {
                    _.assertIsNotDisposed();
                    return new System.Collections.ArrayEnumerator(function () {
                        _.assertIsNotDisposed("The underlying ArrayEnumerable was disposed.");

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
                for (var i = 0 | 0; i < len; ++i)
                    result[i] = s[i];

                return result;
            };

            ArrayEnumerable.prototype.asEnumerable = function () {
                return new ArrayEnumerable(this._source);
            };

            ArrayEnumerable.prototype.forEach = function (action) {
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source;
                if (source) {
                    for (var i = 0 | 0; i < source.length; ++i) {
                        if (action(source[i], i) === false)
                            break;
                    }
                }
            };

            ArrayEnumerable.prototype.any = function (predicate) {
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source, len = source ? source.length : 0;
                return len && (!predicate || _super.prototype.any.call(this, predicate));
            };

            ArrayEnumerable.prototype.count = function (predicate) {
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source, len = source ? source.length : 0;
                return len && (predicate ? _super.prototype.count.call(this, predicate) : len);
            };

            ArrayEnumerable.prototype.elementAt = function (index) {
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source;
                return (index < source.length && index >= 0) ? source[index] : _super.prototype.elementAt.call(this, index);
            };

            ArrayEnumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source;
                return (index < source.length && index >= 0) ? source[index] : defaultValue;
            };

            ArrayEnumerable.prototype.first = function () {
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source;
                return (source && source.length) ? source[0] : _super.prototype.first.call(this);
            };

            ArrayEnumerable.prototype.firstOrDefault = function (defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source;
                return (source && source.length) ? source[0] : defaultValue;
            };

            ArrayEnumerable.prototype.last = function () {
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source, len = source.length;
                return (len) ? source[len - 1] : _super.prototype.last.call(this);
            };

            ArrayEnumerable.prototype.lastOrDefault = function (defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source, len = source.length;
                return len ? source[len - 1] : defaultValue;
            };

            ArrayEnumerable.prototype.skip = function (count) {
                var _ = this;

                if (!count || count < 0)
                    return _.asEnumerable();

                return new Enumerable(function () {
                    return new System.Collections.ArrayEnumerator(function () {
                        return _._source;
                    }, count);
                });
            };

            ArrayEnumerable.prototype.takeExceptLast = function (count) {
                if (typeof count === "undefined") { count = 1; }
                var _ = this, len = _._source ? _._source.length : 0;
                return _.take(len - count);
            };

            ArrayEnumerable.prototype.takeFromLast = function (count) {
                if (!count || count < 0)
                    return Enumerable.empty();
                var _ = this, len = _._source ? _._source.length : 0;
                return _.skip(len - count);
            };

            ArrayEnumerable.prototype.reverse = function () {
                var _ = this;

                return new Enumerable(function () {
                    return new System.Collections.ArrayEnumerator(function () {
                        return _._source;
                    }, _._source ? (_._source.length - 1) : 0, -1);
                });
            };

            ArrayEnumerable.prototype.memoize = function () {
                return new ArrayEnumerable(this._source);
            };

            ArrayEnumerable.prototype.sequenceEqual = function (second, equalityComparer) {
                if (typeof equalityComparer === "undefined") { equalityComparer = System.areEqual; }
                if (second instanceof Array)
                    return ArrayUtility.areEqual(this.source, second, true, equalityComparer);

                if (second instanceof ArrayEnumerable)
                    return second.sequenceEqual(this.source, equalityComparer);

                return _super.prototype.sequenceEqual.call(this, second, equalityComparer);
            };

            ArrayEnumerable.prototype.toJoinedString = function (separator, selector) {
                if (typeof separator === "undefined") { separator = ""; }
                if (typeof selector === "undefined") { selector = Functions.Identity; }
                var s = this._source;
                return !selector && s instanceof Array ? s.join(separator) : _super.prototype.toJoinedString.call(this, separator, selector);
            };
            return ArrayEnumerable;
        })(Enumerable);
        Linq.ArrayEnumerable = ArrayEnumerable;

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
                var composedPredicate = function (x) {
                    return prevPredicate(x) && predicate(x);
                };
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

                return new System.Collections.EnumeratorBase(function () {
                    enumerator = source.getEnumerator();
                }, function (yielder) {
                    while (enumerator.moveNext())
                        if (predicate(enumerator.current))
                            return yielder.yieldReturn(enumerator.current);

                    return false;
                }, function () {
                    enumerator.dispose();
                });
            };

            WhereEnumerable.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this.prevPredicate = null;
                this.prevSource = null;
            };
            return WhereEnumerable;
        })(Enumerable);
        Linq.WhereEnumerable = WhereEnumerable;

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
                var composedSelector = function (x) {
                    return selector(prevSelector(x));
                };
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
                    enumerator.dispose();
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
        Linq.WhereSelectEnumerable = WhereSelectEnumerable;

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
                var index = 0;

                return new System.Collections.EnumeratorBase(function () {
                    buffer = [];
                    indexes = [];
                    Enumerable.forEach(_.source, function (item, index) {
                        buffer.push(item);
                        indexes.push(index);
                    });
                    var sortContext = SortContext.create(_);
                    sortContext.generateKeys(buffer);

                    indexes.sort(function (a, b) {
                        return sortContext.compare(a, b);
                    });
                }, function (yielder) {
                    return (index < indexes.length) ? yielder.yieldReturn(buffer[indexes[index++]]) : false;
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
        Linq.OrderedEnumerable = OrderedEnumerable;

        var SortContext = (function () {
            function SortContext(keySelector, descending, child) {
                this.keySelector = keySelector;
                this.descending = descending;
                this.child = child;
                this.keys = null;
            }
            SortContext.create = function (orderedEnumerable, currentContext) {
                if (typeof currentContext === "undefined") { currentContext = null; }
                var context = new SortContext(orderedEnumerable.keySelector, orderedEnumerable.descending, currentContext);
                if (orderedEnumerable.parent)
                    return SortContext.create(orderedEnumerable.parent, context);
                return context;
            };

            SortContext.prototype.generateKeys = function (source) {
                var _ = this;
                var len = source.length;
                var keySelector = _.keySelector;
                var keys = new Array(len);
                for (var i = 0 | 0; i < len; ++i)
                    keys[i] = keySelector(source[i]);
                _.keys = keys;

                if (_.child)
                    _.child.generateKeys(source);
            };

            SortContext.prototype.compare = function (index1, index2) {
                var _ = this, keys = _.keys;
                var comparison = System.compare(keys[index1], keys[index2]);

                if (comparison == 0) {
                    var child = _.child;
                    return child ? child.compare(index1, index2) : System.compare(index1, index2);
                }

                return _.descending ? -comparison : comparison;
            };
            return SortContext;
        })();

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
                return this._dictionary.get(key);
            };

            Lookup.prototype.contains = function (key) {
                return this._dictionary.containsKey(key);
            };

            Lookup.prototype.getEnumerator = function () {
                var _ = this;
                var enumerator;

                return new System.Collections.EnumeratorBase(function () {
                    enumerator = _._dictionary.getEnumerator();
                }, function (yielder) {
                    if (!enumerator.moveNext())
                        return false;

                    var current = enumerator.current;

                    return yielder.yieldReturn(new Grouping(current.key, current.value));
                }, function () {
                    enumerator.dispose();
                });
            };
            return Lookup;
        })();
        Linq.Lookup = Lookup;

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
        Linq.Grouping = Grouping;
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
//# sourceMappingURL=System.Linq.js.map
