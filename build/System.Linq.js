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

        var EnumeratorBase = System.Collections.EnumeratorBase;

        var Functions = System.Functions;
        var Types = System.Types;

        (function (EnumerableAction) {
            EnumerableAction[EnumerableAction["Break"] = 0] = "Break";
            EnumerableAction[EnumerableAction["Return"] = 1] = "Return";
            EnumerableAction[EnumerableAction["Skip"] = 2] = "Skip";
        })(Linq.EnumerableAction || (Linq.EnumerableAction = {}));
        var EnumerableAction = Linq.EnumerableAction;

        function assertIsNotDisposed(disposed) {
            return System.DisposableBase.assertIsNotDisposed(disposed, "Enumerable was disposed.");
        }

        var Enumerable = (function (_super) {
            __extends(Enumerable, _super);
            function Enumerable(enumeratorFactory, finalizer) {
                _super.call(this, finalizer);
                this.enumeratorFactory = enumeratorFactory;
            }
            Enumerable.fromArray = function (array) {
                return new Linq.ArrayEnumerable(array);
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
                        return yielder.yieldReturn(values[Math.floor(Math.random() * values.length)]);
                    });
                });
            };

            Enumerable.cycle = function (values) {
                return new Enumerable(function () {
                    var index;
                    return new EnumeratorBase(function () {
                        return index = 0;
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
                if (typeof count == Types.Number && (count <= 0 || isNaN(count)))
                    return Enumerable.empty();

                if (!count)
                    count = Infinity;

                return new Enumerable(function () {
                    var index;

                    return new EnumeratorBase(function () {
                        return index = 0;
                    }, function (yielder) {
                        return (index++ < count) ? yielder.yieldReturn(element) : false;
                    });
                });
            };

            Enumerable.repeatWithFinalize = function (initializer, finalizer) {
                return new Enumerable(function () {
                    var element;
                    return new EnumeratorBase(function () {
                        return element = initializer();
                    }, function (yielder) {
                        return yielder.yieldReturn(element);
                    }, function () {
                        if (element != null) {
                            finalizer(element);
                            element = null;
                        }
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
                        return value = start - step;
                    }, function (yielder) {
                        var next = value += step;
                        return (next <= to) ? yielder.yieldReturn(next) : yielder.yieldBreak();
                    }) : new EnumeratorBase(function () {
                        return value = start + step;
                    }, function (yielder) {
                        var next = value -= step;
                        return (next >= to) ? yielder.yieldReturn(next) : yielder.yieldBreak();
                    });
                });
            };

            Enumerable.matches = function (input, pattern, flags) {
                if (typeof flags === "undefined") { flags = ""; }
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
                        return (match) ? yielder.yieldReturn(match) : false;
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
                        return index = 0;
                    }, function (yielder) {
                        return (index++ < count) ? yielder.yieldReturn(factory()) : false;
                    });
                });
            };

            Enumerable.unfold = function (seed, valueFactory) {
                return new Enumerable(function () {
                    var isFirst;
                    var value;
                    return new EnumeratorBase(function () {
                        return isFirst = true;
                    }, function (yielder) {
                        if (isFirst) {
                            isFirst = false;
                            value = seed;
                            return yielder.yieldReturn(value);
                        }
                        value = valueFactory(value);
                        return yielder.yieldReturn(value);
                    });
                });
            };

            Enumerable.defer = function (enumerableFactory) {
                return new Enumerable(function () {
                    var enumerator;

                    return new EnumeratorBase(function () {
                        return enumerator = enumerableFactory().getEnumerator();
                    }, function (yielder) {
                        return (enumerator.moveNext()) ? yielder.yieldReturn(enumerator.current) : yielder.yieldBreak();
                    }, function () {
                        return enumerator.dispose();
                    });
                });
            };

            Enumerable.forEach = function (enumerable, action) {
                var _ = enumerable;

                var index = 0;

                System.using(_.getEnumerator(), function (e) {
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

                System.using(_.getEnumerator(), function (e) {
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
                        return enumerator.dispose();
                    });
                }, function () {
                    return disposed = true;
                });
            };

            Enumerable.prototype.force = function () {
                this.assertIsNotDisposed();

                this.doAction(function (element) {
                    return false;
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

            Enumerable.prototype.select = function (selector) {
                var _ = this, disposed = !_.assertIsNotDisposed();

                if (selector.length < 2)
                    return new Linq.WhereSelectEnumerable(_, null, selector);

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
                        return enumerator.dispose();
                    });
                }, function () {
                    return disposed = true;
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
                        return enumerator.dispose();
                    });
                }, function () {
                    return disposed = true;
                });
            };

            Enumerable.prototype.where = function (predicate) {
                var _ = this, disposed = !_.assertIsNotDisposed();

                if (predicate.length < 2)
                    return new Linq.WhereEnumerable(_, predicate);

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
                        return enumerator.dispose();
                    });
                }, function () {
                    return disposed = true;
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
                    return disposed = true;
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
                        return enumerator.dispose();
                    });
                }, function () {
                    return disposed = true;
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
                        return buffer.length = 0;
                    });
                }, function () {
                    return disposed = true;
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
                        if (len) {
                            var i = Math.floor(Math.random() * len);
                            return yielder.yieldReturn(buffer.splice(i, 1).pop());
                        }
                        return false;
                    }, function () {
                        return buffer.length = 0;
                    });
                }, function () {
                    return disposed = true;
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
                    _.forEach(function (x, i) {
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

            Enumerable.prototype.any = function (predicate) {
                var result = false;

                if (predicate) {
                    this.forEach(function (x) {
                        result = predicate(x);
                        return !result;
                    });
                } else {
                    this.forEach(function (x) {
                        result = true;
                        return false;
                    });
                }
                return result;
            };

            Enumerable.prototype.isEmpty = function () {
                return !this.any();
            };

            Enumerable.prototype.contains = function (value, compareSelector) {
                return compareSelector ? this.any(function (v) {
                    return compareSelector(v) === value;
                }) : this.any(function (v) {
                    return v === value;
                });
            };

            Enumerable.prototype.defaultIfEmpty = function (defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this, disposed = !_.assertIsNotDisposed();

                return new Enumerable(function () {
                    var enumerator;
                    var isFirst = true;

                    return new EnumeratorBase(function () {
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
                        return enumerator.dispose();
                    });
                });
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

            Enumerable.prototype.first = function (predicate) {
                var _ = this;
                _.assertIsNotDisposed();

                if (predicate)
                    return _.where(predicate).first();

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

            Enumerable.prototype.firstOrDefault = function (predicate, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                if (predicate)
                    return _.where(predicate).firstOrDefault(null, defaultValue);

                var value;
                var found = false;
                _.forEach(function (x) {
                    value = x;
                    found = true;
                    return false;
                });
                return (!found) ? defaultValue : value;
            };

            Enumerable.prototype.last = function (predicate) {
                var _ = this;
                _.assertIsNotDisposed();

                if (predicate)
                    return _.where(predicate).last();

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

            Enumerable.prototype.lastOrDefault = function (predicate, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                if (predicate)
                    return _.where(predicate).lastOrDefault(null, defaultValue);

                var value;
                var found = false;
                _.forEach(function (x) {
                    found = true;
                    value = x;
                });
                return (!found) ? defaultValue : value;
            };

            Enumerable.prototype.single = function (predicate) {
                var _ = this;
                _.assertIsNotDisposed();

                if (predicate)
                    return _.where(predicate).single();

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

            Enumerable.prototype.singleOrDefault = function (predicate, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                if (predicate)
                    return _.where(predicate).singleOrDefault(null, defaultValue);

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
                        return enumerator.dispose();
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
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
var System;
(function (System) {
    (function (Linq) {
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
                _super.prototype._onDispose;
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
                return this.source ? this.source.slice() : [];
            };

            ArrayEnumerable.prototype.asEnumerable = function () {
                return new ArrayEnumerable(this._source);
            };

            ArrayEnumerable.prototype.forEach = function (action) {
                var _ = this;
                _.assertIsNotDisposed();

                var source = _._source;
                if (source) {
                    for (var i = 0; i < source.length; ++i) {
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

                var source = this._source;
                return (index < source.length && index >= 0) ? source[index] : _super.prototype.elementAt.call(this, index);
            };

            ArrayEnumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var source = this._source;
                return (index < source.length && index >= 0) ? source[index] : defaultValue;
            };

            ArrayEnumerable.prototype.first = function (predicate) {
                var _ = this;
                _.assertIsNotDisposed();

                var source = this._source;
                return (source && source.length && !predicate) ? source[0] : _super.prototype.first.call(this, predicate);
            };

            ArrayEnumerable.prototype.firstOrDefault = function (predicate, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var source = this._source;
                return (source && source.length) ? (predicate ? _super.prototype.firstOrDefault.call(this, predicate, defaultValue) : source[0]) : defaultValue;
            };

            ArrayEnumerable.prototype.last = function (predicate) {
                var _ = this;
                _.assertIsNotDisposed();

                var source = this._source, len = source.length;
                return (len && !predicate) ? source[len - 1] : _super.prototype.last.call(this, predicate);
            };

            ArrayEnumerable.prototype.lastOrDefault = function (predicate, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;
                _.assertIsNotDisposed();

                var source = this._source, len = source.length;
                return len ? (predicate ? _super.prototype.firstOrDefault.call(this, predicate, defaultValue) : source[len - 1]) : defaultValue;
            };

            ArrayEnumerable.prototype.skip = function (count) {
                var _ = this;

                return (!count || count < 0) ? _.asEnumerable() : new Linq.Enumerable(function () {
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
                var _ = this, len = _._source ? _._source.length : 0;
                return _.skip(len - count);
            };

            ArrayEnumerable.prototype.reverse = function () {
                var _ = this;

                return new Linq.Enumerable(function () {
                    return new System.Collections.ArrayEnumerator(function () {
                        return _._source;
                    }, _._source ? (_._source.length - 1) : 0, -1);
                });
            };

            ArrayEnumerable.prototype.memoize = function () {
                return new ArrayEnumerable(this._source);
            };
            return ArrayEnumerable;
        })(Linq.Enumerable);
        Linq.ArrayEnumerable = ArrayEnumerable;
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
var System;
(function (System) {
    (function (Linq) {
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
        })(Linq.ArrayEnumerable);
        Linq.Grouping = Grouping;
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
var System;
(function (System) {
    (function (Linq) {
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
                    return enumerator = _._dictionary.getEnumerator();
                }, function (yielder) {
                    if (!enumerator.moveNext())
                        return false;

                    var current = enumerator.current;

                    return yielder.yieldReturn(new Linq.Grouping(current.key, current.value));
                }, function () {
                    return enumerator.dispose();
                });
            };
            return Lookup;
        })();
        Linq.Lookup = Lookup;
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
var System;
(function (System) {
    (function (Linq) {
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

                return new Linq.WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector);
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
                    return enumerator.dispose();
                });
            };

            WhereEnumerable.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this.prevPredicate = null;
                this.prevSource = null;
            };
            return WhereEnumerable;
        })(Linq.Enumerable);
        Linq.WhereEnumerable = WhereEnumerable;
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
var System;
(function (System) {
    (function (Linq) {
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

                return new Linq.WhereEnumerable(this, predicate);
            };

            WhereSelectEnumerable.prototype.select = function (selector) {
                if (selector.length > 1)
                    return _super.prototype.select.call(this, selector);

                var prevSelector = this.prevSelector;
                var composedSelector = function (x) {
                    return selector(prevSelector(x));
                };
                return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, composedSelector);
            };

            WhereSelectEnumerable.prototype.getEnumerator = function () {
                var predicate = this.prevPredicate;
                var selector = this.prevSelector;
                var source = this.prevSource;
                var enumerator;

                return new System.Collections.EnumeratorBase(function () {
                    enumerator = source.getEnumerator();
                }, function (yielder) {
                    while (enumerator.moveNext()) {
                        if (predicate == null || predicate(enumerator.current)) {
                            return yielder.yieldReturn(selector(enumerator.current));
                        }
                    }
                    return false;
                }, function () {
                    return enumerator.dispose();
                });
            };

            WhereSelectEnumerable.prototype._onDispose = function () {
                _super.prototype._onDispose.call(this);
                this.prevPredicate = null;
                this.prevSource = null;
                this.prevSelector = null;
            };
            return WhereSelectEnumerable;
        })(Linq.Enumerable);
        Linq.WhereSelectEnumerable = WhereSelectEnumerable;
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
var System;
(function (System) {
    (function (Linq) {
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
                    Linq.Enumerable.forEach(_.source, function (item, index) {
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
        })(Linq.Enumerable);
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
                for (var i = 0; i < len; ++i)
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
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
//# sourceMappingURL=System.Linq.js.map
