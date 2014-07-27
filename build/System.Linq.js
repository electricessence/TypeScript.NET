var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var System;
(function (System) {
    (function (Linq) {
        var EnumeratorBase = System.Collections.EnumeratorBase;

        var Functions = System.Functions;
        var Types = System.Types;

        (function (EnumerableAction) {
            EnumerableAction[EnumerableAction["Break"] = 0] = "Break";
            EnumerableAction[EnumerableAction["Return"] = 1] = "Return";
            EnumerableAction[EnumerableAction["Skip"] = 2] = "Skip";
        })(Linq.EnumerableAction || (Linq.EnumerableAction = {}));
        var EnumerableAction = Linq.EnumerableAction;

        var Enumerable = (function (_super) {
            __extends(Enumerable, _super);
            function Enumerable(enumeratorFactory) {
                _super.call(this);
                this.enumeratorFactory = enumeratorFactory;
            }
            Enumerable.prototype.getEnumerator = function () {
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
                    var index = 0;
                    return new EnumeratorBase(null, function (yielder) {
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
                    var index = 0;

                    return new EnumeratorBase(function () {
                        return value = start - step;
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
                    var isFirst = true;
                    var value;
                    return new EnumeratorBase(null, function (yielder) {
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

            Enumerable.prototype.forEach = function (action) {
                var index = 0;

                System.using(this.getEnumerator(), function (e) {
                    while (e.moveNext() && action(e.current, index++) !== false) {
                    }
                });
            };

            Enumerable.prototype.doAction = function (action) {
                var _ = this;

                return new Enumerable(function () {
                    var enumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        index = 0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
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
                });
            };

            Enumerable.prototype.skip = function (count) {
                return this.doAction(function (element, index) {
                    return index < count ? 2 /* Skip */ : 1 /* Return */;
                });
            };

            Enumerable.prototype.skipWhile = function (predicate) {
                var skipping = true;

                return this.doAction(function (element, index) {
                    if (skipping)
                        skipping = predicate(element, index);

                    return skipping ? 2 /* Skip */ : 1 /* Return */;
                });
            };

            Enumerable.prototype.take = function (count) {
                var _ = this;

                return _.doAction(function (element, index) {
                    return index < count;
                });
            };

            Enumerable.prototype.select = function (selector) {
                var _ = this;
                return new Enumerable(function () {
                    var enumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        index = 0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        return enumerator.moveNext() ? yielder.yieldReturn(selector(enumerator.current, index++)) : false;
                    }, function () {
                        return enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.where = function (predicate) {
                var _ = this;

                return new Enumerable(function () {
                    var enumerator;
                    var index;

                    return new EnumeratorBase(function () {
                        index = 0;
                        enumerator = _.getEnumerator();
                    }, function (yielder) {
                        while (enumerator.moveNext()) {
                            if (predicate(enumerator.current, index++)) {
                                return yielder.yieldReturn(enumerator.current);
                            }
                        }
                        return false;
                    }, function () {
                        return enumerator.dispose();
                    });
                });
            };

            Enumerable.prototype.singleOrDefault = function (predicate, defaultValue) {
                if (typeof defaultValue === "undefined") { defaultValue = null; }
                var _ = this;

                if (predicate != null)
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
            return Enumerable;
        })(System.DisposableBase);
        Linq.Enumerable = Enumerable;
    })(System.Linq || (System.Linq = {}));
    var Linq = System.Linq;
})(System || (System = {}));
//# sourceMappingURL=System.Linq.js.map
