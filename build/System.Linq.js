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
            if (disposed)
                throw new Error("Enumerable was disposed.");

            return true;
        }

        var Enumerable = (function (_super) {
            __extends(Enumerable, _super);
            function Enumerable(enumeratorFactory, finalizer) {
                _super.call(this, finalizer);
                this.enumeratorFactory = enumeratorFactory;
            }
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

            Enumerable.prototype.assertIsNotDisposed = function () {
                return assertIsNotDisposed(this.wasDisposed);
            };

            Enumerable.forEach = function (enumerable, action) {
                var _ = enumerable;

                var index = 0;

                System.using(_.getEnumerator(), function (e) {
                    while (e.moveNext() && action(e.current, index++) !== false) {
                    }
                });
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

                return this.doAction(function (element, index) {
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

                return this.doAction(function (element, index) {
                    return index < count;
                });
            };

            Enumerable.prototype.select = function (selector) {
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

                        return enumerator.moveNext() ? yielder.yieldReturn(selector(enumerator.current, index++)) : false;
                    }, function () {
                        return enumerator.dispose();
                    });
                }, function () {
                    return disposed = true;
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
//# sourceMappingURL=System.Linq.js.map
