var System;
(function (System) {
    "use strict";

    var Functions = (function () {
        function Functions() {
        }
        Functions.prototype.Identity = function (x) {
            return x;
        };
        Functions.prototype.True = function () {
            return true;
        };
        Functions.prototype.False = function () {
            return false;
        };
        Functions.prototype.Blank = function () {
        };

        Object.defineProperty(Functions, "Identity", {
            get: function () {
                return rootFunctions.Identity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Functions, "True", {
            get: function () {
                return rootFunctions.True;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Functions, "False", {
            get: function () {
                return rootFunctions.False;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Functions, "Blank", {
            get: function () {
                return rootFunctions.Blank;
            },
            enumerable: true,
            configurable: true
        });
        return Functions;
    })();
    System.Functions = Functions;

    var rootFunctions = new Functions();
})(System || (System = {}));
var System;
(function (System) {
    "use strict";

    var Types = (function () {
        function Types() {
            this.Boolean = typeof true;
            this.Number = typeof 0;
            this.String = typeof "";
            this.Object = typeof {};
            this.Null = typeof null;
            this.Undefined = typeof undefined;
            this.Function = typeof System.Functions.Blank;
        }
        Object.defineProperty(Types, "Boolean", {
            get: function () {
                return typeof true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Types, "Number", {
            get: function () {
                return typeof 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Types, "String", {
            get: function () {
                return typeof "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Types, "Object", {
            get: function () {
                return typeof {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Types, "Null", {
            get: function () {
                return typeof null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Types, "Undefined", {
            get: function () {
                return typeof undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Types, "Function", {
            get: function () {
                return typeof System.Functions.Blank;
            },
            enumerable: true,
            configurable: true
        });

        Types.prototype.isBoolean = function (type) {
            return typeof type === this.Boolean;
        };

        Types.isBoolean = function (type) {
            return typeof type === Types.Boolean;
        };

        Types.prototype.isNumber = function (type) {
            return typeof type === this.Number;
        };

        Types.isNumber = function (type) {
            return typeof type === Types.Number;
        };

        Types.prototype.isString = function (type) {
            return typeof type === this.String;
        };

        Types.isString = function (type) {
            return typeof type === Types.String;
        };

        Types.prototype.isFunction = function (type) {
            return typeof type === this.Function;
        };

        Types.isFunction = function (type) {
            return typeof type === Types.Function;
        };
        return Types;
    })();
    System.Types = Types;
})(System || (System = {}));
var System;
(function (System) {
    var Types = new System.Types();

    

    function isEqualToNaN(n) {
        return typeof n === Types.Number && isNaN(n);
    }
    System.isEqualToNaN = isEqualToNaN;

    function areEqual(a, b, strict) {
        if (typeof strict === "undefined") { strict = true; }
        return a === b || !strict && a == b || isEqualToNaN(a) && isEqualToNaN(b);
    }
    System.areEqual = areEqual;

    function compare(a, b, strict) {
        if (typeof strict === "undefined") { strict = true; }
        if (areEqual(a, b, strict))
            return 0 | 0;

        if (a > b)
            return (+1) | 0;

        if (b < a)
            return (-1) | 0;

        return NaN;
    }
    System.compare = compare;

    function clone(source, depth) {
        if (typeof depth === "undefined") { depth = 0; }
        if (depth < 0)
            return source;

        switch (typeof source) {
            case Types.Undefined:
            case Types.Null:
            case Types.String:
            case Types.Boolean:
            case Types.Number:
            case Types.Function:
                return source;
        }

        var result;
        if (source instanceof Array) {
            result = source.slice();
            if (depth > 0) {
                for (var i = 0; i < result.length; i++)
                    if (i in result)
                        result[i] = clone(result[i], depth - 1);
            }
        } else {
            result = {};
            if (depth > 0)
                for (var k in source) {
                    result[k] = clone(source[k], depth - 1);
                }
        }

        return result;
    }
    System.clone = clone;

    function copyTo(source, target) {
        for (var k in source) {
            target[k] = source[k];
        }
    }
    System.copyTo = copyTo;

    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
    System.applyMixins = applyMixins;
})(System || (System = {}));
var System;
(function (System) {
    (function (Text) {
        function format(source) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            for (var i = 0; i < args.length; i++)
                source = source.replace("{" + i + "}", args[i]);
            return source;
        }
        Text.format = format;
    })(System.Text || (System.Text = {}));
    var Text = System.Text;
})(System || (System = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var System;
(function (System) {
    (function (Collections) {
        "use strict";

        var Yielder = (function () {
            function Yielder() {
            }
            Object.defineProperty(Yielder.prototype, "current", {
                get: function () {
                    return this._current;
                },
                enumerable: true,
                configurable: true
            });

            Yielder.prototype.yieldReturn = function (value) {
                this._current = value;
                return true;
            };

            Yielder.prototype.yieldBreak = function () {
                this._current = null;
                return false;
            };
            return Yielder;
        })();

        var EnumeratorState;
        (function (EnumeratorState) {
            EnumeratorState[EnumeratorState["Before"] = 0] = "Before";
            EnumeratorState[EnumeratorState["Running"] = 1] = "Running";
            EnumeratorState[EnumeratorState["After"] = 2] = "After";
        })(EnumeratorState || (EnumeratorState = {}));

        (function (Enumerator) {
            function from(source) {
                if (source instanceof Array)
                    return new ArrayEnumerator(source);

                if (typeof source === System.Types.Object && "length" in source)
                    return new IndexEnumerator(function () {
                        return {
                            source: source,
                            length: source.length,
                            pointer: 0,
                            step: 1
                        };
                    });

                if ("getEnumerator" in source)
                    return source.getEnumerator();

                throw new Error("Unknown enumerable.");
            }
            Enumerator.from = from;

            function forEach(e, action) {
                if (e) {
                    var index = 0;

                    while (e.moveNext()) {
                        if (action(e.current, index++) === false)
                            break;
                    }
                }
            }
            Enumerator.forEach = forEach;
        })(Collections.Enumerator || (Collections.Enumerator = {}));
        var Enumerator = Collections.Enumerator;

        var EnumeratorBase = (function (_super) {
            __extends(EnumeratorBase, _super);
            function EnumeratorBase(initializer, tryGetNext, disposer) {
                _super.call(this);
                this.initializer = initializer;
                this.tryGetNext = tryGetNext;
                this.disposer = disposer;
                this.reset();
            }
            Object.defineProperty(EnumeratorBase.prototype, "current", {
                get: function () {
                    return this._yielder.current;
                },
                enumerable: true,
                configurable: true
            });

            EnumeratorBase.prototype.reset = function () {
                var _ = this;
                _._yielder = new Yielder();
                _._state = 0 /* Before */;
            };

            EnumeratorBase.prototype.moveNext = function () {
                var _ = this;
                try  {
                    switch (_._state) {
                        case 0 /* Before */:
                            _._state = 1 /* Running */;
                            var initializer = _.initializer;
                            if (initializer)
                                initializer();

                        case 1 /* Running */:
                            if (_.tryGetNext(_._yielder)) {
                                return true;
                            } else {
                                this.dispose();
                                return false;
                            }
                        case 2 /* After */:
                            return false;
                    }
                } catch (e) {
                    this.dispose();
                    throw e;
                }
            };

            EnumeratorBase.prototype._onDispose = function () {
                var _ = this, disposer = _.disposer;

                _.initializer = null;
                _.disposer = null;

                var yielder = _._yielder;
                _._yielder = null;
                if (yielder)
                    yielder.yieldBreak();

                try  {
                    if (disposer)
                        disposer();
                } finally {
                    this._state = 2 /* After */;
                }
            };
            return EnumeratorBase;
        })(System.DisposableBase);
        Collections.EnumeratorBase = EnumeratorBase;

        var IndexEnumerator = (function (_super) {
            __extends(IndexEnumerator, _super);
            function IndexEnumerator(sourceFactory) {
                var source;
                _super.call(this, function () {
                    source = sourceFactory();
                    if (source && source.source) {
                        if (source.length && source.step === 0)
                            throw new Error("Invalid IndexEnumerator step value (0).");

                        var pointer = source.pointer;
                        if (!pointer)
                            source.pointer = 0 | 0;
                        else if (pointer != Math.floor(pointer))
                            throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                        source.pointer = pointer | 0;

                        var step = source.step;
                        if (!step)
                            source.step = 1;
                        else if (step != Math.floor(step))
                            throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                        source.step = step | 0;
                    }
                }, function (yielder) {
                    var len = (source && source.source) ? source.length : 0;
                    if (!len)
                        return yielder.yieldBreak();
                    var current = source.pointer | 0;
                    source.pointer += source.step;
                    return (current < len && current >= 0) ? yielder.yieldReturn(source.source[current]) : yielder.yieldBreak();
                }, function () {
                    if (source) {
                        source.source = null;
                    }
                });
            }
            return IndexEnumerator;
        })(EnumeratorBase);
        Collections.IndexEnumerator = IndexEnumerator;

        var ArrayEnumerator = (function (_super) {
            __extends(ArrayEnumerator, _super);
            function ArrayEnumerator(arrayOrFactory, start, step) {
                if (typeof start === "undefined") { start = 0; }
                if (typeof step === "undefined") { step = 1; }
                _super.call(this, function () {
                    var array = System.Types.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
                    return { source: array, pointer: start, length: (array ? array.length : 0), step: step };
                });
            }
            return ArrayEnumerator;
        })(IndexEnumerator);
        Collections.ArrayEnumerator = ArrayEnumerator;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var System;
(function (System) {
    (function (Collections) {
        (function (ArrayUtility) {
            function initialize(length) {
                var array;
                if (length > 65536)
                    array = new Array(length);
                else {
                    array = new Array();
                    array.length = length;
                }
                return array;
            }
            ArrayUtility.initialize = initialize;

            function copy(sourceArray, sourceIndex, length) {
                if (typeof sourceIndex === "undefined") { sourceIndex = 0; }
                if (typeof length === "undefined") { length = Infinity; }
                if (!sourceArray)
                    return sourceArray;

                var sourceLength = sourceArray.length;

                return (sourceIndex || length < sourceLength) ? sourceArray.slice(sourceIndex, Math.min(length, sourceLength) - sourceLength) : sourceArray.slice();
            }
            ArrayUtility.copy = copy;

            function copyTo(sourceArray, destinationArray, sourceIndex, destinationIndex, length) {
                if (typeof sourceIndex === "undefined") { sourceIndex = 0; }
                if (typeof destinationIndex === "undefined") { destinationIndex = 0; }
                if (typeof length === "undefined") { length = Infinity; }
                if (!sourceArray)
                    throw new Error("ArgumentNullException: source array cannot be null.");

                if (!destinationArray)
                    throw new Error("ArgumentNullException: destination array cannot be null.");

                if (sourceIndex < 0)
                    throw new Error("ArgumentOutOfRangeException: source index cannot be less than zero.");

                var sourceLength = sourceArray.length;
                if (sourceIndex >= sourceLength)
                    throw new Error("ArgumentOutOfRangeException: the source index must be less than the length of the source array.");

                if (destinationArray.length < 0)
                    throw new Error("ArgumentOutOfRangeException: destination index cannot be less than zero.");

                var maxLength = sourceArray.length - sourceIndex;
                if (isFinite(length) && length > maxLength)
                    throw new Error("ArgumentOutOfRangeException: source index + length cannot exceed the length of the source array.");

                length = Math.min(length, maxLength);

                for (var i = 0; i < length; ++i)
                    destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
            }
            ArrayUtility.copyTo = copyTo;

            function contains(array, item) {
                return !array ? false : array.indexOf(item) != -1;
            }
            ArrayUtility.contains = contains;

            function replace(array, old, newValue, max) {
                var count = 0 | 0;
                if (max !== 0) {
                    if (!max)
                        max = Infinity;

                    for (var i = (array.length - 1) | 0; i >= 0; --i)
                        if (array[i] === old) {
                            array[i] = newValue;
                            ++count;
                            if (!--max)
                                break;
                        }
                }

                return count;
            }
            ArrayUtility.replace = replace;

            function updateRange(array, value, index, length) {
                var end = index + length;
                for (var i = index; i < end; ++i) {
                    array[i] = value;
                }
            }
            ArrayUtility.updateRange = updateRange;

            function clear(array, index, length) {
                updateRange(array, null, index, length);
            }
            ArrayUtility.clear = clear;

            function register(array, item) {
                if (!array)
                    throw new Error("ArgumentNullException: 'array' cannot be null.");
                var len = array.length;
                var ok = !len || !contains(array, item);
                if (ok)
                    array[len] = item;
                return ok;
            }
            ArrayUtility.register = register;

            function findIndex(array, predicate) {
                if (!array)
                    throw new Error("ArgumentNullException: 'array' cannot be null.");
                var len = array.length | 0;
                for (var i = 0 | 0; i < len; ++i)
                    if (i in array && predicate(array[i]))
                        return i;

                return -1;
            }
            ArrayUtility.findIndex = findIndex;

            function areAllEqual(arrays, strict) {
                if (!arrays)
                    throw new Error("ArgumentNullException: 'arrays' cannot be null.");
                if (arrays.length < 2)
                    throw new Error("Cannot compare a set of arrays less than 2.");
                var first = arrays[0];
                for (var i = 0 | 0, l = arrays.length | 0; i < l; ++i) {
                    if (!areEqual(first, arrays[i], strict))
                        return false;
                }
                return true;
            }
            ArrayUtility.areAllEqual = areAllEqual;

            function areEqual(a, b, strict, equalityComparer) {
                if (typeof equalityComparer === "undefined") { equalityComparer = System.areEqual; }
                if (a === b)
                    return true;

                var len = a.length | 0;
                if (len != (b.length | 0))
                    return false;

                for (var i = 0 | 0; i < len; ++i)
                    if (!equalityComparer(a[i], b[i], strict))
                        return false;

                return true;
            }
            ArrayUtility.areEqual = areEqual;

            function applyTo(target, fn) {
                if (!target)
                    throw new Error("ArgumentNullException: 'target' cannot be null.");

                if (fn) {
                    for (var i = 0 | 0; i < target.length; ++i)
                        target[i] = fn(target[i]);
                }
                return target;
            }
            ArrayUtility.applyTo = applyTo;

            function removeIndex(array, index) {
                if (!array)
                    throw new Error("ArgumentNullException: 'array' cannot be null.");

                var exists = index < array.length;
                if (exists)
                    array.splice(index, 1);
                return exists;
            }
            ArrayUtility.removeIndex = removeIndex;

            function remove(array, value, max) {
                if (!array)
                    throw new Error("ArgumentNullException: 'array' cannot be null.");

                var count = 0;
                if (array && array.length && max !== 0) {
                    if (!max)
                        max = Infinity;

                    for (var i = (array.length - 1) | 0; i >= 0; --i)
                        if (array[i] === value) {
                            array.splice(i, 1);
                            ++count;
                            if (!--max)
                                break;
                        }
                }

                return count;
            }
            ArrayUtility.remove = remove;

            function repeat(element, count) {
                var result = [];
                while (count--)
                    result.push(element);

                return result;
            }
            ArrayUtility.repeat = repeat;

            function sum(source, ignoreNaN) {
                if (typeof ignoreNaN === "undefined") { ignoreNaN = false; }
                if (!source || !source.length)
                    return 0;

                var result = 0;
                if (ignoreNaN)
                    source.forEach(function (n) {
                        if (!isNaN(n))
                            result += n;
                    });
                else
                    source.every(function (n) {
                        result += n;
                        return !isNaN(result);
                    });

                return result;
            }
            ArrayUtility.sum = sum;

            function average(source, ignoreNaN) {
                if (typeof ignoreNaN === "undefined") { ignoreNaN = false; }
                if (!source || !source.length)
                    return NaN;

                var result = 0, count;
                if (ignoreNaN) {
                    count = 0;
                    source.forEach(function (n) {
                        if (!isNaN(n)) {
                            result += n;
                            count++;
                        }
                    });
                } else {
                    count = source.length;
                    source.every(function (n) {
                        result += n;
                        return !isNaN(result);
                    });
                }

                return (!count || isNaN(result)) ? NaN : (result / count);
            }
            ArrayUtility.average = average;

            function product(source, ignoreNaN) {
                if (typeof ignoreNaN === "undefined") { ignoreNaN = false; }
                if (!source || !source.length)
                    return NaN;

                var result = 1;
                if (ignoreNaN) {
                    var found = false;
                    source.forEach(function (n) {
                        if (!isNaN(n)) {
                            result *= n;
                            if (!found)
                                found = true;
                        }
                    });

                    if (!found)
                        result = NaN;
                } else {
                    source.every(function (n) {
                        if (isNaN(n)) {
                            result = NaN;
                            return false;
                        }

                        result *= n;

                        return true;
                    });
                }

                return result;
            }
            ArrayUtility.product = product;

            function ifSet(source, start, ignoreNaN, predicate) {
                if (!source || !source.length)
                    return NaN;

                var result = start;
                if (ignoreNaN) {
                    var found = false;
                    source.forEach(function (n) {
                        if (!isNaN(n)) {
                            if (predicate(n, result))
                                result = n;
                            if (!found)
                                found = true;
                        }
                    });

                    if (!found)
                        result = NaN;
                } else {
                    source.every(function (n) {
                        if (isNaN(n)) {
                            result = NaN;
                            return false;
                        }

                        if (predicate(n, result))
                            result = n;

                        return true;
                    });
                }
                return result;
            }

            function min(source, ignoreNaN) {
                if (typeof ignoreNaN === "undefined") { ignoreNaN = false; }
                return ifSet(source, +Infinity, ignoreNaN, function (n, result) {
                    return n < result;
                });
            }
            ArrayUtility.min = min;

            function max(source, ignoreNaN) {
                if (typeof ignoreNaN === "undefined") { ignoreNaN = false; }
                return ifSet(source, -Infinity, ignoreNaN, function (n, result) {
                    return n > result;
                });
            }
            ArrayUtility.max = max;
        })(Collections.ArrayUtility || (Collections.ArrayUtility = {}));
        var ArrayUtility = Collections.ArrayUtility;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var System;
(function (System) {
    (function (Collections) {
        

        var INT_0 = 0 | 0;
        var INT_1 = 1 | 0;

        var Node = (function () {
            function Node(value, prev, next) {
                this.value = value;
                this.prev = prev;
                this.next = next;
            }
            Node.prototype.assertDetached = function () {
                if (this.next || this.prev)
                    throw new Error("InvalidOperationException: adding a node that is already placed.");
            };
            return Node;
        })();

        function ensureExternal(node, list) {
            if (!node)
                return null;

            var external = node.external;
            if (!external)
                node.external = external = new LinkedListNode(list, node);

            return external;
        }

        function getInternal(node, list) {
            if (!node)
                throw new Error("ArgumentNullException: 'node' cannot be null.");

            if (node.list != list)
                throw new Error("InvalidOperationException: provided node does not belong to this list.");

            var n = node._node;
            if (!n)
                throw new Error("InvalidOperationException: provided node is not valid.");

            return n;
        }

        var LinkedList = (function () {
            function LinkedList(source) {
                var _ = this, c = INT_0, first = null, last = null;
                var e = Collections.Enumerator.from(source);

                if (e.moveNext()) {
                    first = last = new Node(e.current);
                    ++c;
                }

                while (e.moveNext()) {
                    last = last.next = new Node(e.current, last);
                    ++c;
                }

                _._first = first;
                _._last = last;
                _._count = c;
            }
            LinkedList.prototype._addFirst = function (entry) {
                var _ = this, first = _._first;
                var prev = new Node(entry, null, first);
                if (first) {
                    first.prev = prev;
                    first = prev;
                } else
                    _._first = _._last = prev;

                _._count += INT_1;

                return prev;
            };

            LinkedList.prototype._addLast = function (entry) {
                var _ = this, last = _._last;
                var next = new Node(entry, last);
                if (last) {
                    last.next = next;
                    last = next;
                } else
                    _._first = _._last = next;

                _._count += INT_1;

                return next;
            };

            LinkedList.prototype._addNodeBefore = function (n, inserting) {
                inserting.assertDetached();

                inserting.next = n;
                inserting.prev = n.prev;

                n.prev.next = inserting;
                n.prev = inserting;

                this._count += INT_1;
            };

            LinkedList.prototype._addNodeAfter = function (n, inserting) {
                inserting.assertDetached();

                inserting.prev = n;
                inserting.next = n.next;

                n.next.prev = inserting;
                n.next = inserting;

                this._count += INT_1;
            };

            LinkedList.prototype._findFirst = function (entry) {
                var equals = System.areEqual, next = this._first;
                while (next) {
                    if (equals(entry, next.value))
                        return next;
                    next = next.next;
                }
                return null;
            };

            LinkedList.prototype._findLast = function (entry) {
                var equals = System.areEqual, prev = this._last;
                while (prev) {
                    if (equals(entry, prev.value))
                        return prev;
                    prev = prev.prev;
                }
                return null;
            };

            LinkedList.prototype.forEach = function (action) {
                var next = this._first, index = INT_0;
                while (next && action(next.value, index++) !== false) {
                    next = next.next;
                }
            };

            LinkedList.prototype.getEnumerator = function () {
                var _ = this, current;
                return new Collections.EnumeratorBase(function () {
                    current = new Node(null, null, _._first);
                }, function (yielder) {
                    return (current = current.next) ? yielder.yieldReturn(current.value) : yielder.yieldBreak();
                });
            };

            Object.defineProperty(LinkedList.prototype, "count", {
                get: function () {
                    return this._count;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LinkedList.prototype, "isReadOnly", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });

            LinkedList.prototype.add = function (entry) {
                this._addLast(entry);
            };

            LinkedList.prototype.clear = function () {
                var _ = this;
                _._first = null;
                _._last = null;
                var count = _._count;
                _._count = 0;
                return count;
            };

            LinkedList.prototype.contains = function (entry) {
                var found = false, equals = System.areEqual;
                this.forEach(function (e) {
                    return !(found = equals(entry, e));
                });
                return found;
            };

            LinkedList.prototype.copyTo = function (array, index) {
                if (typeof index === "undefined") { index = 0; }
                this.forEach(function (entry, i) {
                    array[index + i] = entry;
                });
            };

            LinkedList.prototype.removeOnce = function (entry) {
                var _ = this;
                var node = _._findFirst(entry);
                if (node) {
                    var prev = node.prev, next = node.next;
                    if (prev)
                        prev.next = next;
                    else
                        _._first = next;
                    if (next)
                        next.prev = prev;
                    else
                        _._last = prev;

                    _._count -= INT_1;
                }

                return node != null;
            };

            LinkedList.prototype.remove = function (entry) {
                var _ = this, removedCount = INT_0;
                while (_.removeOnce(entry)) {
                    ++removedCount;
                }
                return removedCount;
            };

            LinkedList.prototype.toArray = function () {
                var array = Collections.ArrayUtility.initialize(this._count);
                this.copyTo(array);
                return array;
            };

            Object.defineProperty(LinkedList.prototype, "first", {
                get: function () {
                    return ensureExternal(this._first, this);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LinkedList.prototype, "last", {
                get: function () {
                    return ensureExternal(this._last, this);
                },
                enumerable: true,
                configurable: true
            });

            LinkedList.prototype._get = function (index) {
                if (index < 0)
                    throw new Error("ArgumentOutOfRangeException: index is less than zero.");

                if (index >= this._count)
                    throw new Error("ArgumentOutOfRangeException: index is greater than count.");

                var next = this._first, i = INT_0;
                while (next && index < i++) {
                    next = next.next;
                }

                return next;
            };

            LinkedList.prototype.get = function (index) {
                return this._get(index).value;
            };

            LinkedList.prototype.getNode = function (index) {
                return ensureExternal(this._get(index), this);
            };

            LinkedList.prototype.find = function (entry) {
                return ensureExternal(this._findFirst(entry), this);
            };

            LinkedList.prototype.findLast = function (entry) {
                return ensureExternal(this._findLast(entry), this);
            };

            LinkedList.prototype.addFirst = function (entry) {
                this._addFirst(entry);
            };

            LinkedList.prototype.addLast = function (entry) {
                this._addLast(entry);
            };

            LinkedList.prototype.removeFirst = function () {
                var _ = this, first = _._first;
                if (first) {
                    var next = first.next;
                    _._first = next;
                    if (next)
                        next.prev = null;

                    _._count -= INT_1;
                }
            };

            LinkedList.prototype.removeLast = function () {
                var _ = this, last = _._last;
                if (last) {
                    var prev = last.prev;
                    _._last = prev;
                    if (prev)
                        prev.next = null;

                    _._count -= INT_1;
                }
            };

            LinkedList.prototype.removeNode = function (node) {
                var _ = this;
                var n = getInternal(node, _);
                var prev = n.prev, next = n.next, a = false, b = false;

                if (prev)
                    prev.next = next;
                else if (_._first == n)
                    _._first = next;
                else
                    a = true;

                if (next)
                    next.prev = prev;
                else if (_._last == n)
                    _._last = prev;
                else
                    b = true;

                if (a !== b) {
                    throw new Error(System.Text.format("Exception: provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
                }

                return !a && !b;
            };

            LinkedList.prototype.addBefore = function (node, entry) {
                this._addNodeBefore(getInternal(node, this), new Node(entry));
            };

            LinkedList.prototype.addAfter = function (node, entry) {
                this._addNodeAfter(getInternal(node, this), new Node(entry));
            };

            LinkedList.prototype.addNodeBefore = function (node, before) {
                this._addNodeBefore(getInternal(node, this), getInternal(before, this));
            };

            LinkedList.prototype.addNodeAfter = function (node, after) {
                this._addNodeAfter(getInternal(node, this), getInternal(after, this));
            };
            return LinkedList;
        })();
        Collections.LinkedList = LinkedList;

        var LinkedListNode = (function () {
            function LinkedListNode(_list, _node) {
                this._list = _list;
                this._node = _node;
            }
            Object.defineProperty(LinkedListNode.prototype, "list", {
                get: function () {
                    return this._list;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LinkedListNode.prototype, "previous", {
                get: function () {
                    return ensureExternal(this._node.prev, this._list);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedListNode.prototype, "next", {
                get: function () {
                    return ensureExternal(this._node.next, this._list);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedListNode.prototype, "value", {
                get: function () {
                    return this._node.value;
                },
                set: function (v) {
                    this._node.value = v;
                },
                enumerable: true,
                configurable: true
            });

            LinkedListNode.prototype.addBefore = function (entry) {
                this._list.addBefore(this, entry);
            };

            LinkedListNode.prototype.addAfter = function (entry) {
                this._list.addAfter(this, entry);
            };

            LinkedListNode.prototype.addNodeBefore = function (before) {
                this._list.addNodeBefore(this, before);
            };

            LinkedListNode.prototype.addNodeAfter = function (after) {
                this._list.addNodeAfter(this, after);
            };
            return LinkedListNode;
        })();
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var System;
(function (System) {
    (function (Collections) {
        var MINIMUMGROW = 4 | 0;

        var GROWFACTOR_HALF = 100 | 0;
        var DEFAULTCAPACITY = MINIMUMGROW;
        var emptyArray = [];

        function assertInteger(value, property) {
            if (value != Math.floor(value))
                throw new Error("InvalidOperationException: " + property + " must be an interger.");
        }

        function assertZeroOrGreater(value, property) {
            if (value < 0)
                throw new Error("ArgumentOutOfRangeException: " + property + " must be greater than zero");
        }

        function assertIntegerZeroOrGreater(value, property) {
            assertInteger(value, property);
            assertZeroOrGreater(value, property);
        }

        var Queue = (function () {
            function Queue(source) {
                var _ = this;
                _._head = 0;
                _._tail = 0;
                _._size = 0;
                _._version = 0;

                if (!source)
                    _._array = emptyArray;
                else {
                    if (System.Types.isNumber(source)) {
                        assertIntegerZeroOrGreater(source, "source");

                        _._array = source ? Collections.ArrayUtility.initialize(source) : emptyArray;
                    } else {
                        _._array = Collections.ArrayUtility.initialize(source instanceof Array || "length" in source ? source.length : DEFAULTCAPACITY);

                        Collections.Enumerable.forEach(source, function (e) {
                            return _.enqueue(e);
                        });

                        _._version = 0;
                    }
                }
            }
            Object.defineProperty(Queue.prototype, "count", {
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Queue.prototype, "isReadOnly", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });

            Queue.prototype.add = function (item) {
                this.enqueue(item);
            };

            Queue.prototype.clear = function () {
                var _ = this, array = _._array, head = _._head, tail = _._tail, size = _._size;
                if (head < tail)
                    Collections.ArrayUtility.clear(array, head, size);
                else {
                    Collections.ArrayUtility.clear(array, head, array.length - head);
                    Collections.ArrayUtility.clear(array, 0, tail);
                }

                _._head = 0;
                _._tail = 0;
                _._size = 0;
                _._version++;

                return size;
            };

            Queue.prototype.contains = function (item) {
                var _ = this;
                var array = _._array, index = _._head, count = _._size, len = array.length;

                while (count-- > 0) {
                    if (System.areEqual(array[index], item))
                        return true;

                    index = (index + 1) % len;
                }

                return false;
            };

            Queue.prototype.copyTo = function (target, arrayIndex) {
                if (typeof arrayIndex === "undefined") { arrayIndex = 0; }
                if (target == null)
                    throw new Error("ArgumentNullException: array cannot be null.");

                assertIntegerZeroOrGreater(arrayIndex, "arrayIndex");

                var arrayLen = target.length, _ = this, size = _._size;

                var numToCopy = (arrayLen - arrayIndex < size) ? (arrayLen - arrayIndex) : size;
                if (numToCopy == 0)
                    return;

                var source = _._array, len = source.length, head = _._head, lh = len - head;
                var firstPart = (lh < numToCopy) ? lh : numToCopy;

                Collections.ArrayUtility.copyTo(source, target, head, arrayIndex, firstPart);
                numToCopy -= firstPart;

                if (numToCopy > 0)
                    Collections.ArrayUtility.copyTo(source, target, 0, arrayIndex + source.length - head, numToCopy);
            };

            Queue.prototype.remove = function (item) {
                throw new Error("ICollection<T>.remove is not implemented in Queue<T> since it would require destroying the underlying array to remove the item.");
            };

            Queue.prototype.toArray = function () {
                var _ = this, size = _._size;
                var arr = Collections.ArrayUtility.initialize(size);
                if (size == 0)
                    return arr;

                _.copyTo(arr);

                return arr;
            };

            Queue.prototype.setCapacity = function (capacity) {
                assertIntegerZeroOrGreater(capacity, "capacity");

                var _ = this, array = _._array, len = array.length;

                if (capacity == len)
                    return;

                var head = _._head, tail = _._tail, size = _._size;

                if (array != emptyArray && capacity > len && head < tail) {
                    array.length = capacity;
                    _._version++;
                    return;
                }

                var newarray = Collections.ArrayUtility.initialize(capacity);
                if (size > 0) {
                    if (head < tail) {
                        Collections.ArrayUtility.copyTo(array, newarray, head, 0, size);
                    } else {
                        Collections.ArrayUtility.copyTo(array, newarray, head, 0, len - head);
                        Collections.ArrayUtility.copyTo(array, newarray, 0, len - head, tail);
                    }
                }

                _._array = newarray;
                _._head = 0;
                _._tail = (size == capacity) ? 0 : size;
                _._version++;
            };

            Queue.prototype.enqueue = function (item) {
                var _ = this, array = _._array, size = _._size | 0, len = array.length | 0;
                if (size == len) {
                    var newcapacity = len * GROWFACTOR_HALF;
                    if (newcapacity < len + MINIMUMGROW)
                        newcapacity = len + MINIMUMGROW;

                    _.setCapacity(newcapacity);
                    array = _._array;
                    len = array.length;
                }

                var tail = _._tail;
                array[tail] = item;
                _._tail = (tail + 1) % len;
                _._size = size + 1;
                _._version++;
            };

            Queue.prototype.dequeue = function () {
                var _ = this;
                if (_._size == 0)
                    throw new Error("InvalidOperatioException: cannot call peek on an empty queue.");

                var array = _._array, head = _._head;

                var removed = _._array[head];
                array[head] = null;
                _._head = (head + 1) % array.length;

                _._size--;
                _._version++;
                return removed;
            };

            Queue.prototype._getElement = function (index) {
                assertIntegerZeroOrGreater(index, "index");

                var _ = this;
                return _._array[(_._head + index) % _._array.length];
            };

            Queue.prototype.peek = function () {
                if (this._size == 0)
                    throw new Error("InvalidOperatioException: cannot call peek on an empty queue.");

                return this._array[this._head];
            };

            Queue.prototype.trimExcess = function () {
                var _ = this;
                var size = _._size;
                if (size < Math.floor(_._array.length * 0.9))
                    _.setCapacity(size);
            };

            Queue.prototype.getEnumerator = function () {
                var _ = this;
                var index;
                var version;
                return new Collections.EnumeratorBase(function () {
                    version = _._version;
                    index = 0;
                }, function (yieler) {
                    if (version != _._version)
                        throw new Error("InvalidOperationException: collection was changed during enumeration.");

                    if (index == _._size)
                        return yieler.yieldBreak();

                    return yieler.yieldReturn(_._getElement(index++));
                });
            };
            return Queue;
        })();
        Collections.Queue = Queue;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var System;
(function (System) {
    "use strict";

    var ticksPerMillisecond = 10000, msPerSecond = 1000, secondsPerMinute = 60, minutesPerHour = 60, earthHoursPerDay = 24;

    function pluralize(value, label) {
        if (Math.abs(value) !== 1)
            label += "s";

        return label;
    }

    (function (TimeUnit) {
        TimeUnit[TimeUnit["Ticks"] = 0] = "Ticks";
        TimeUnit[TimeUnit["Milliseconds"] = 1] = "Milliseconds";
        TimeUnit[TimeUnit["Seconds"] = 2] = "Seconds";
        TimeUnit[TimeUnit["Minutes"] = 3] = "Minutes";
        TimeUnit[TimeUnit["Hours"] = 4] = "Hours";
        TimeUnit[TimeUnit["Days"] = 5] = "Days";
    })(System.TimeUnit || (System.TimeUnit = {}));
    var TimeUnit = System.TimeUnit;

    function assertValidUnit(unit) {
        if (isNaN(unit) || unit > 5 /* Days */ || unit < 0 /* Ticks */ || Math.floor(unit) !== unit)
            throw new Error("Invalid TimeUnit.");

        return true;
    }

    var ClockTime = (function () {
        function ClockTime() {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this._totalMilliseconds = args.length > 1 ? TimeSpan.millisecondsFromTime(args[0] || 0, args[1] || 0, args.length > 2 && args[2] || 0, args.length > 3 && args[3] || 0) : (args.length > 0 && args[0] || 0);
        }
        Object.defineProperty(ClockTime.prototype, "totalMilliseconds", {
            get: function () {
                return this._totalMilliseconds;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClockTime.prototype, "direction", {
            get: function () {
                return System.compare(this._totalMilliseconds, 0);
            },
            enumerable: true,
            configurable: true
        });

        ClockTime.prototype.equals = function (other) {
            return System.areEqual(this._totalMilliseconds, other.totalMilliseconds);
        };

        ClockTime.prototype.compareTo = function (other) {
            if (other == null)
                return 1 | 0;

            return System.compare(this._totalMilliseconds, other.totalMilliseconds);
        };

        Object.defineProperty(ClockTime.prototype, "ticks", {
            get: function () {
                var _ = this, r = _._ticks;
                if (r === undefined) {
                    var ms = Math.abs(_._totalMilliseconds);
                    _._ticks = r = (ms - Math.floor(ms)) * ticksPerMillisecond;
                }
                return r;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClockTime.prototype, "milliseconds", {
            get: function () {
                var _ = this, r = _._ms;
                if (r === undefined)
                    _._ms = r = (this._totalMilliseconds % msPerSecond) | 0;
                return r;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClockTime.prototype, "seconds", {
            get: function () {
                var _ = this, r = _._seconds;
                if (r === undefined)
                    _._seconds = r = ((this._totalMilliseconds / msPerSecond) % secondsPerMinute) | 0;
                return r;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClockTime.prototype, "minutes", {
            get: function () {
                var _ = this, r = _._minutes;
                if (r === undefined)
                    _._minutes = r = ((this._totalMilliseconds / msPerSecond / secondsPerMinute) % minutesPerHour) | 0;

                return r;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClockTime.prototype, "hours", {
            get: function () {
                var _ = this, r = _._hours;
                if (r === undefined)
                    _._hours = r = ((this._totalMilliseconds / msPerSecond / secondsPerMinute / minutesPerHour) % earthHoursPerDay) | 0;
                return r;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClockTime.prototype, "days", {
            get: function () {
                var _ = this, r = _._days;
                if (r === undefined)
                    _._days = r = (this._totalMilliseconds / msPerSecond / secondsPerMinute / minutesPerHour / earthHoursPerDay) | 0;
                return r;
            },
            enumerable: true,
            configurable: true
        });
        ClockTime.prototype.toTimeSpan = function () {
            return new TimeSpan(this._totalMilliseconds);
        };

        ClockTime.from = function (hours, minutes, seconds, milliseconds) {
            if (typeof seconds === "undefined") { seconds = 0; }
            if (typeof milliseconds === "undefined") { milliseconds = 0; }
            return new ClockTime(hours, minutes, seconds, milliseconds);
        };

        ClockTime.prototype.toString = function (format, formatProvider) {
            var _ = this, a = [];

            if (_.days)
                a.push(pluralize(_.days, "day"));

            if (_.hours)
                a.push(pluralize(_.hours, "hour"));

            if (_.minutes)
                a.push(pluralize(_.minutes, "minute"));

            if (_.seconds)
                a.push(pluralize(_.seconds, "second"));

            if (a.length > 1)
                a.splice(a.length - 1, 0, "and");

            return a.join(", ").replace(", and, ", " and ");
        };
        return ClockTime;
    })();
    System.ClockTime = ClockTime;

    function assertComparisonType(other) {
        if (!(other instanceof TimeUnitValue || other instanceof TimeSpan))
            throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
    }

    function getMilliseconds(other) {
        if (other instanceof TimeUnitValue) {
            var o = other;
            return o.type === 1 /* Milliseconds */ ? o.value : o.toTimeSpan().milliseconds;
        } else if (other instanceof TimeSpan) {
            return other._milliseconds;
        }

        return undefined;
    }

    var TimeUnitValue = (function () {
        function TimeUnitValue(value, _type) {
            this.value = value;
            this._type = _type;
            assertValidUnit(_type);
        }
        TimeUnitValue.prototype.coerce = function (other) {
            var type = this._type;
            assertValidUnit(type);

            if (other instanceof TimeSpan) {
                other = other.toTimeUnitValue(type);
            } else if (other instanceof TimeUnitValue) {
                if (type !== other.type)
                    other = other.to(type);
            } else
                return null;

            return other;
        };

        TimeUnitValue.prototype.equals = function (other) {
            var o = this.coerce(other);
            if (o == null)
                return false;

            return System.areEqual(this.value, o.value);
        };

        TimeUnitValue.prototype.compareTo = function (other) {
            if (other == null)
                return 1 | 0;

            assertComparisonType(other);

            return System.compare(this.value, this.coerce(other).value);
        };

        Object.defineProperty(TimeUnitValue.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });

        TimeUnitValue.prototype.toTimeSpan = function () {
            return new TimeSpan(this.value, this.type);
        };

        TimeUnitValue.prototype.to = function (units) {
            if (typeof units === "undefined") { units = this.type; }
            return this.toTimeSpan().toTimeUnitValue(units);
        };
        return TimeUnitValue;
    })();
    System.TimeUnitValue = TimeUnitValue;

    var timeSpanZero;

    var TimeSpan = (function () {
        function TimeSpan(value, units) {
            if (typeof units === "undefined") { units = 1 /* Milliseconds */; }
            this._milliseconds = TimeSpan.convertToMilliseconds(value, units);
        }
        TimeSpan.prototype.equals = function (other) {
            var otherms = getMilliseconds(other);

            if (other === undefined)
                return false;

            return System.areEqual(this._milliseconds, otherms);
        };

        TimeSpan.prototype.compareTo = function (other) {
            if (other == null)
                return 1 | 0;

            assertComparisonType(other);

            return System.compare(this._milliseconds, getMilliseconds(other));
        };

        TimeSpan.prototype.toTimeUnitValue = function (units) {
            if (typeof units === "undefined") { units = 1 /* Milliseconds */; }
            return new TimeUnitValue(this.total(units), units);
        };

        TimeSpan.convertToMilliseconds = function (value, units) {
            if (typeof units === "undefined") { units = 1 /* Milliseconds */; }
            switch (units) {
                case 5 /* Days */:
                    value *= earthHoursPerDay;
                case 4 /* Hours */:
                    value *= minutesPerHour;
                case 3 /* Minutes */:
                    value *= secondsPerMinute;
                case 2 /* Seconds */:
                    value *= msPerSecond;
                case 1 /* Milliseconds */:
                    return value;
                case 0 /* Ticks */:
                    return value / ticksPerMillisecond;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        };

        TimeSpan.prototype.total = function (units) {
            var _ = this;
            switch (units) {
                case 5 /* Days */:
                    return _.days;
                case 4 /* Hours */:
                    return _.hours;
                case 3 /* Minutes */:
                    return _.minutes;
                case 2 /* Seconds */:
                    return _.seconds;
                case 1 /* Milliseconds */:
                    return _._milliseconds;
                case 0 /* Ticks */:
                    return _._milliseconds * ticksPerMillisecond;
                default:
                    throw new Error("Invalid TimeUnit.");
            }
        };

        Object.defineProperty(TimeSpan.prototype, "ticks", {
            get: function () {
                return this._milliseconds * ticksPerMillisecond;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TimeSpan.prototype, "milliseconds", {
            get: function () {
                return this._milliseconds;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TimeSpan.prototype, "seconds", {
            get: function () {
                return this._milliseconds / msPerSecond;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TimeSpan.prototype, "minutes", {
            get: function () {
                return this.seconds / secondsPerMinute;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TimeSpan.prototype, "hours", {
            get: function () {
                return this.minutes / minutesPerHour;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TimeSpan.prototype, "days", {
            get: function () {
                return this.hours / earthHoursPerDay;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TimeSpan.prototype, "time", {
            get: function () {
                return new ClockTime(this._milliseconds);
            },
            enumerable: true,
            configurable: true
        });

        TimeSpan.prototype.add = function (other) {
            if (System.Types.isNumber(other))
                throw new Error("Use .addUnit to add a numerical value amount.  .add only supports ClockTime, TimeSpan, and TimeUnitValue.");
            if (other instanceof TimeUnitValue || other instanceof ClockTime)
                other = other.toTimeSpan();
            return new TimeSpan(this._milliseconds + other.milliseconds);
        };

        TimeSpan.prototype.addUnit = function (value, units) {
            if (typeof units === "undefined") { units = 1 /* Milliseconds */; }
            return new TimeSpan(this._milliseconds + TimeSpan.convertToMilliseconds(value, units));
        };

        TimeSpan.from = function (value, units) {
            return new TimeSpan(value, units);
        };

        TimeSpan.fromDays = function (value) {
            return new TimeSpan(value, 5 /* Days */);
        };

        TimeSpan.fromHours = function (value) {
            return new TimeSpan(value, 4 /* Hours */);
        };

        TimeSpan.fromMinutes = function (value) {
            return new TimeSpan(value, 3 /* Minutes */);
        };

        TimeSpan.fromSeconds = function (value) {
            return new TimeSpan(value, 2 /* Seconds */);
        };

        TimeSpan.fromMilliseconds = function (value) {
            return new TimeSpan(value, 1 /* Milliseconds */);
        };

        TimeSpan.fromTicks = function (value) {
            return new TimeSpan(value, 0 /* Ticks */);
        };

        TimeSpan.fromTime = function (hours, minutes, seconds, milliseconds) {
            if (typeof seconds === "undefined") { seconds = 0; }
            if (typeof milliseconds === "undefined") { milliseconds = 0; }
            return new TimeSpan(TimeSpan.millisecondsFromTime(hours, minutes, seconds, milliseconds));
        };

        TimeSpan.millisecondsFromTime = function (hours, minutes, seconds, milliseconds) {
            if (typeof seconds === "undefined") { seconds = 0; }
            if (typeof milliseconds === "undefined") { milliseconds = 0; }
            var value = hours;
            value *= minutesPerHour;
            value += minutes;
            value *= secondsPerMinute;
            value += seconds;
            value *= msPerSecond;
            value += milliseconds;
            return value;
        };

        TimeSpan.between = function (first, last) {
            return new TimeSpan(last.getTime() - first.getTime());
        };

        Object.defineProperty(TimeSpan, "zero", {
            get: function () {
                return timeSpanZero || (timeSpanZero = new TimeSpan(0));
            },
            enumerable: true,
            configurable: true
        });
        return TimeSpan;
    })();
    System.TimeSpan = TimeSpan;
})(System || (System = {}));
var System;
(function (System) {
    (function (Diagnostics) {
        var Stopwatch = (function () {
            function Stopwatch() {
                this.reset();
            }
            Stopwatch.getTimestampMilliseconds = function () {
                return (new Date()).getTime();
            };

            Object.defineProperty(Stopwatch.prototype, "isRunning", {
                get: function () {
                    return this._isRunning;
                },
                enumerable: true,
                configurable: true
            });

            Stopwatch.startNew = function () {
                var s = new Stopwatch();
                s.start();
                return s;
            };

            Stopwatch.measure = function (closure) {
                var start = Stopwatch.getTimestampMilliseconds();
                closure();
                return new System.TimeSpan(Stopwatch.getTimestampMilliseconds() - start);
            };

            Stopwatch.prototype.record = function (closure) {
                var e = Stopwatch.measure(closure);
                this._elapsed += e.milliseconds;
                return e;
            };

            Stopwatch.prototype.start = function () {
                var _ = this;
                if (!_._isRunning) {
                    _._startTimeStamp = Stopwatch.getTimestampMilliseconds();
                    _._isRunning = true;
                }
            };

            Stopwatch.prototype.stop = function () {
                var _ = this;
                if (_._isRunning) {
                    _._elapsed += _.currentLapMilliseconds;
                    _._isRunning = false;
                }
            };

            Stopwatch.prototype.reset = function () {
                var _ = this;
                _._elapsed = 0;
                _._isRunning = false;
                _._startTimeStamp = NaN;
            };

            Stopwatch.prototype.lap = function () {
                var _ = this;
                if (_._isRunning) {
                    var t = Stopwatch.getTimestampMilliseconds();
                    var s = _._startTimeStamp;
                    var e = t - s;
                    _._startTimeStamp = t;
                    _._elapsed += e;
                    return new System.TimeSpan(e);
                } else
                    return System.TimeSpan.zero;
            };

            Object.defineProperty(Stopwatch.prototype, "currentLapMilliseconds", {
                get: function () {
                    return this._isRunning ? (Stopwatch.getTimestampMilliseconds() - this._startTimeStamp) : 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stopwatch.prototype, "currentLap", {
                get: function () {
                    return this._isRunning ? new System.TimeSpan(this.currentLapMilliseconds) : System.TimeSpan.zero;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stopwatch.prototype, "elapsedMilliseconds", {
                get: function () {
                    var _ = this;
                    var timeElapsed = _._elapsed;

                    if (_._isRunning)
                        timeElapsed += _.currentLapMilliseconds;

                    return timeElapsed;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stopwatch.prototype, "elapsed", {
                get: function () {
                    return new System.TimeSpan(this.elapsedMilliseconds);
                },
                enumerable: true,
                configurable: true
            });
            return Stopwatch;
        })();
        Diagnostics.Stopwatch = Stopwatch;
    })(System.Diagnostics || (System.Diagnostics = {}));
    var Diagnostics = System.Diagnostics;
})(System || (System = {}));
var System;
(function (System) {
    function dispose() {
        var disposables = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            disposables[_i] = arguments[_i + 0];
        }
        disposeTheseInternal(disposables, false);
    }
    System.dispose = dispose;

    function disposeWithoutException() {
        var disposables = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            disposables[_i] = arguments[_i + 0];
        }
        disposeTheseInternal(disposables, true);
    }
    System.disposeWithoutException = disposeWithoutException;

    function disposeSingle(disposable, ignoreExceptions) {
        if (disposable && typeof disposable.dispose == System.Types.Function) {
            if (ignoreExceptions) {
                try  {
                    disposable.dispose();
                } catch (ex) {
                }
            } else
                disposable.dispose();
        }
    }

    function disposeTheseInternal(disposables, ignoreExceptions) {
        var next;

        while (disposables.length && !(next = disposables.shift())) {
        }
        if (next) {
            try  {
                disposeSingle(next, ignoreExceptions);
            } finally {
                disposeTheseInternal(disposables, ignoreExceptions);
            }
        }
    }

    function disposeThese(disposables, ignoreExceptions) {
        if (disposables && disposables.length)
            disposeTheseInternal(disposables.slice(), ignoreExceptions);
    }
    System.disposeThese = disposeThese;

    function using(disposable, closure) {
        try  {
            return closure(disposable);
        } finally {
            dispose(disposable);
        }
    }
    System.using = using;

    

    var DisposableBase = (function () {
        function DisposableBase(_finalizer) {
            this._finalizer = _finalizer;
            this._wasDisposed = false;
        }
        Object.defineProperty(DisposableBase.prototype, "wasDisposed", {
            get: function () {
                return this._wasDisposed;
            },
            enumerable: true,
            configurable: true
        });

        DisposableBase.assertIsNotDisposed = function (disposed, errorMessage) {
            if (typeof errorMessage === "undefined") { errorMessage = "ObjectDisposedException"; }
            if (disposed)
                throw new Error(errorMessage);

            return true;
        };

        DisposableBase.prototype.assertIsNotDisposed = function (errorMessage) {
            if (typeof errorMessage === "undefined") { errorMessage = "ObjectDisposedException"; }
            return DisposableBase.assertIsNotDisposed(this._wasDisposed, errorMessage);
        };

        DisposableBase.prototype.dispose = function () {
            var _ = this;
            if (!_._wasDisposed) {
                _._wasDisposed = true;
                try  {
                    _._onDispose();
                } finally {
                    if (_._finalizer)
                        _._finalizer();
                }
            }
        };

        DisposableBase.prototype._onDispose = function () {
        };
        return DisposableBase;
    })();
    System.DisposableBase = DisposableBase;
})(System || (System = {}));
var System;
(function (System) {
    var Lazy = (function (_super) {
        __extends(Lazy, _super);
        function Lazy(_closure) {
            _super.call(this);
            this._closure = _closure;
        }
        Object.defineProperty(Lazy.prototype, "isValueCreated", {
            get: function () {
                return this._isValueCreated;
            },
            enumerable: true,
            configurable: true
        });

        Lazy.prototype.reset = function () {
            var _ = this;
            if (!_._closure)
                throw new Error("Cannot reset.  This Lazy has de-referenced its closure.");

            _._isValueCreated = false;
            _._value = null;
        };

        Object.defineProperty(Lazy.prototype, "value", {
            get: function () {
                var _ = this;
                if (!_._isValueCreated && _._closure) {
                    var v = _._closure();
                    _._value = v;
                    _._isValueCreated = true;
                    return v;
                }

                return _._value;
            },
            enumerable: true,
            configurable: true
        });

        Lazy.prototype.valueOnce = function () {
            try  {
                return this.value;
            } finally {
                this._closure = null;
            }
        };

        Lazy.prototype._onDispose = function () {
            this._closure = null;
            this._value = null;
        };
        return Lazy;
    })(System.DisposableBase);
    System.Lazy = Lazy;
})(System || (System = {}));
var System;
(function (System) {
    var AU = System.Collections.ArrayUtility;

    var EventDispatcherEntry = (function (_super) {
        __extends(EventDispatcherEntry, _super);
        function EventDispatcherEntry(type, listener, useCapture, priority) {
            if (typeof useCapture === "undefined") { useCapture = false; }
            if (typeof priority === "undefined") { priority = 0; }
            _super.call(this);

            this.type = type;
            this.listener = listener;
            this.useCapture = useCapture;
            this.priority = priority;
        }
        EventDispatcherEntry.prototype.dispose = function () {
            this.listener = null;
        };

        Object.defineProperty(EventDispatcherEntry.prototype, "wasDisposed", {
            get: function () {
                return this.listener == null;
            },
            enumerable: true,
            configurable: true
        });

        EventDispatcherEntry.prototype.matches = function (type, listener, useCapture) {
            if (typeof useCapture === "undefined") { useCapture = false; }
            var _ = this;
            return _.type == type && _.listener == listener && _.useCapture == useCapture;
        };

        EventDispatcherEntry.prototype.equals = function (other) {
            var _ = this;
            return _.type == other.type && _.listener == other.listener && _.useCapture == other.useCapture && _.priority == other.priority;
        };
        return EventDispatcherEntry;
    })(System.DisposableBase);

    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            _super.apply(this, arguments);
            this._isDisposing = false;
        }
        EventDispatcher.prototype.addEventListener = function (type, listener, useCapture, priority) {
            if (typeof useCapture === "undefined") { useCapture = false; }
            if (typeof priority === "undefined") { priority = 0; }
            var l = this._listeners;
            if (!l)
                this._listeners = l = [];

            l.push(new EventDispatcherEntry(type, listener, useCapture, priority));
        };

        EventDispatcher.prototype.registerEventListener = function (type, listener, useCapture, priority) {
            if (typeof useCapture === "undefined") { useCapture = false; }
            if (typeof priority === "undefined") { priority = 0; }
            if (!this.hasEventListener(type, listener, useCapture))
                this.addEventListener(type, listener, useCapture, priority);
        };

        EventDispatcher.prototype.hasEventListener = function (type, listener, useCapture) {
            if (typeof useCapture === "undefined") { useCapture = false; }
            var l = this._listeners;
            return l && l.some(function (value) {
                return type == value.type && (!listener || listener == value.listener && useCapture == value.useCapture);
            });
        };

        EventDispatcher.prototype.removeEventListener = function (type, listener, userCapture) {
            if (typeof userCapture === "undefined") { userCapture = false; }
            var l = this._listeners;

            if (l) {
                var i = AU.findIndex(l, function (entry) {
                    return entry.matches(type, listener, userCapture);
                });
                if (i != -1) {
                    var e = l[i];
                    l.splice(i, 1);
                    e.dispose();
                }
            }
        };

        EventDispatcher.prototype.dispatchEvent = function (e, params) {
            var _this = this;
            var _ = this, l = _._listeners;
            if (!l || !l.length)
                return false;

            var event;

            if (typeof e == "string") {
                event = new Event();
                if (!params)
                    params = {};
                event.cancelable = !!params.cancelable;
                event.target = _;
                event.type = e;
            } else
                event = e;

            var type = event.type;

            var entries = [];
            l.forEach(function (e) {
                if (e.type == type)
                    entries.push(e);
            });
            if (!entries.length)
                return false;

            entries.sort(function (a, b) {
                return b.priority - a.priority;
            });

            entries.forEach(function (entry) {
                var newEvent = new Event();
                System.copyTo(event, newEvent);
                newEvent.target = _this;
                entry.listener(newEvent);
            });

            return true;
        };

        Object.defineProperty(EventDispatcher, "DISPOSING", {
            get: function () {
                return "disposing";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventDispatcher, "DISPOSED", {
            get: function () {
                return "disposed";
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventDispatcher.prototype, "isDisposing", {
            get: function () {
                return this._isDisposing;
            },
            enumerable: true,
            configurable: true
        });

        EventDispatcher.prototype.dispose = function () {
            var _ = this;
            if (!_.wasDisposed && !_._isDisposing) {
                _._isDisposing = true;
                _.dispatchEvent(EventDispatcher.DISPOSING);

                _super.prototype.dispose.call(this);

                _.dispatchEvent(EventDispatcher.DISPOSED);

                var l = _._listeners;
                if (l) {
                    this._listeners = null;
                    l.forEach(function (e) {
                        return e.dispose();
                    });
                }
            }
        };
        return EventDispatcher;
    })(System.DisposableBase);
    System.EventDispatcher = EventDispatcher;
})(System || (System = {}));
var System;
(function (System) {
    (function (Collections) {
        (function (Enumerable) {
            function forEach(enumerable, action) {
                if (enumerable) {
                    System.using(enumerable.getEnumerator(), function (e) {
                        Collections.Enumerator.forEach(e, action);
                    });
                }
            }
            Enumerable.forEach = forEach;
        })(Collections.Enumerable || (Collections.Enumerable = {}));
        var Enumerable = Collections.Enumerable;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var System;
(function (System) {
    (function (Collections) {
        function notImplementedException(name, log) {
            if (typeof log === "undefined") { log = ""; }
            console.log("DictionaryAbstractBase sub-class has not overridden " + name + ". " + log);
            throw new Error("DictionaryAbstractBase." + name + ": Not implemented.");
        }

        var DictionaryAbstractBase = (function () {
            function DictionaryAbstractBase() {
                this._updateRecursion = 0;
            }
            Object.defineProperty(DictionaryAbstractBase.prototype, "isUpdating", {
                get: function () {
                    return this._updateRecursion != 0;
                },
                enumerable: true,
                configurable: true
            });

            DictionaryAbstractBase.prototype._onValueUpdate = function (key, value, old) {
                if (!System.areEqual(value, old, true)) {
                    var _ = this;
                    if (_.onValueChanged)
                        _.onValueChanged(key, value, old);

                    if (_._updateRecursion == 0)
                        _._onUpdated();
                }
            };

            DictionaryAbstractBase.prototype._onUpdated = function () {
                var _ = this;
                if (_.onUpdated)
                    _.onUpdated();
            };

            DictionaryAbstractBase.prototype.handleUpdate = function (closure) {
                var _ = this, result;
                if (closure) {
                    _._updateRecursion++;

                    try  {
                        result = closure();
                    } finally {
                        _._updateRecursion--;
                    }
                } else
                    result = _._updateRecursion == 0;

                if (result && _._updateRecursion == 0)
                    _._onUpdated();

                return result;
            };

            Object.defineProperty(DictionaryAbstractBase.prototype, "isReadOnly", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DictionaryAbstractBase.prototype, "count", {
                get: function () {
                    return notImplementedException("count");
                },
                enumerable: true,
                configurable: true
            });

            DictionaryAbstractBase.prototype.add = function (item) {
                this.addByKeyValue(item.key, item.value);
            };

            DictionaryAbstractBase.prototype.clear = function () {
                var _ = this, keys = _.keys, count = keys.length;

                if (count)
                    _.handleUpdate(function () {
                        keys.forEach(function (key) {
                            return _.removeByKey(key);
                        });
                        return true;
                    });

                if (count != _.count)
                    console.warn("Dictioary clear() results in mismatched count.");

                return count;
            };

            DictionaryAbstractBase.prototype.contains = function (item) {
                var value = this.get(item.key);
                return System.areEqual(value, item.value);
            };

            DictionaryAbstractBase.prototype.copyTo = function (array, index) {
                if (typeof index === "undefined") { index = 0; }
                var e = this.getEnumerator();
                while (e.moveNext())
                    array[index++] = e.current;
            };

            DictionaryAbstractBase.prototype.remove = function (item) {
                var key = item.key, value = this.get(key);
                return (System.areEqual(value, item.value) && this.removeByKey(key)) ? 1 : 0;
            };

            Object.defineProperty(DictionaryAbstractBase.prototype, "keys", {
                get: function () {
                    return notImplementedException("keys");
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DictionaryAbstractBase.prototype, "values", {
                get: function () {
                    return notImplementedException("values");
                },
                enumerable: true,
                configurable: true
            });

            DictionaryAbstractBase.prototype.addByKeyValue = function (key, value) {
                var _ = this;
                if (_.containsKey(key))
                    throw new Error("Adding key/value when one already exists.");

                _.set(key, value);
            };

            DictionaryAbstractBase.prototype.get = function (key) {
                return notImplementedException("get(key: TKey): TValue", "When calling for key: " + key);
            };

            DictionaryAbstractBase.prototype.set = function (key, value) {
                return notImplementedException("set(key: TKey, value: TValue): boolean", "When setting " + key + ":" + value + ".");
            };

            DictionaryAbstractBase.prototype.containsKey = function (key) {
                var value = this.get(key);
                return value !== undefined;
            };

            DictionaryAbstractBase.prototype.containsValue = function (value) {
                var e = this.getEnumerator(), equal = System.areEqual;

                while (e.moveNext()) {
                    if (equal(e.current, value, true)) {
                        e.dispose();
                        return true;
                    }
                }
                return false;
            };

            DictionaryAbstractBase.prototype.removeByKey = function (key) {
                return this.set(key, undefined);
            };

            DictionaryAbstractBase.prototype.removeByValue = function (value) {
                var _ = this, count = 0, equal = System.areEqual;
                _.keys.forEach(function (key) {
                    if (equal(_.get(key), value, true)) {
                        _.removeByKey(key);
                        ++count;
                    }
                });
                return count;
            };

            DictionaryAbstractBase.prototype.importPairs = function (pairs) {
                var _ = this;
                return _.handleUpdate(function () {
                    var changed = false;
                    pairs.forEach(function (pair) {
                        _.set(pair.key, pair.value);
                        changed = true;
                    });
                    return changed;
                });
            };

            DictionaryAbstractBase.prototype.getEnumerator = function () {
                var _ = this;
                var keys, len, i = 0;
                return new Collections.EnumeratorBase(function () {
                    keys = _.keys;
                    len = keys.length;
                }, function (yielder) {
                    while (i < len) {
                        var key = keys[i++], value = _.get(key);
                        if (value !== undefined)
                            return yielder.yieldReturn({ key: key, value: value });
                    }

                    return yielder.yieldBreak();
                });
            };
            return DictionaryAbstractBase;
        })();
        Collections.DictionaryAbstractBase = DictionaryAbstractBase;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var System;
(function (System) {
    (function (Collections) {
        var HashEntry = (function () {
            function HashEntry(key, value, prev, next) {
                this.key = key;
                this.value = value;
                this.prev = prev;
                this.next = next;
            }
            return HashEntry;
        })();

        var EntryList = (function () {
            function EntryList(first, last) {
                this.first = first;
                this.last = last;
            }
            EntryList.prototype.addLast = function (entry) {
                var _ = this;
                if (_.last != null) {
                    _.last.next = entry;
                    entry.prev = _.last;
                    _.last = entry;
                } else
                    _.first = _.last = entry;
            };

            EntryList.prototype.replace = function (entry, newEntry) {
                var _ = this;
                if (entry.prev != null) {
                    entry.prev.next = newEntry;
                    newEntry.prev = entry.prev;
                } else
                    _.first = newEntry;

                if (entry.next != null) {
                    entry.next.prev = newEntry;
                    newEntry.next = entry.next;
                } else
                    _.last = newEntry;
            };

            EntryList.prototype.remove = function (entry) {
                var _ = this;
                if (entry.prev != null)
                    entry.prev.next = entry.next;
                else
                    _.first = entry.next;

                if (entry.next != null)
                    entry.next.prev = entry.prev;
                else
                    _.last = entry.prev;
            };

            EntryList.prototype.clear = function () {
                var _ = this;
                while (_.last)
                    _.remove(_.last);
            };

            EntryList.prototype.forEach = function (closure) {
                var _ = this, currentEntry = _.first;
                while (currentEntry) {
                    closure(currentEntry);
                    currentEntry = currentEntry.next;
                }
            };
            return EntryList;
        })();

        function callHasOwnProperty(target, key) {
            return Object.prototype.hasOwnProperty.call(target, key);
        }

        function computeHashCode(obj) {
            if (obj === null)
                return "null";
            if (obj === undefined)
                return "undefined";

            return (typeof obj.toString === System.Types.Function) ? obj.toString() : Object.prototype.toString.call(obj);
        }

        var Dictionary = (function (_super) {
            __extends(Dictionary, _super);
            function Dictionary(compareSelector) {
                if (typeof compareSelector === "undefined") { compareSelector = System.Functions.Identity; }
                _super.call(this);
                this.compareSelector = compareSelector;
                this._count = 0;
                this._entries = new EntryList();
                this._buckets = {};
            }
            Dictionary.prototype.setKV = function (key, value, allowOverwrite) {
                var _ = this, buckets = _._buckets, entries = _._entries, comparer = _.compareSelector;
                var compareKey = comparer(key);
                var hash = computeHashCode(compareKey), entry;

                if (callHasOwnProperty(buckets, hash)) {
                    var equal = System.areEqual;
                    var array = buckets[hash];
                    for (var i = 0; i < array.length; i++) {
                        var old = array[i];
                        if (comparer(old.key) === compareKey) {
                            if (!allowOverwrite)
                                throw new Error("Key already exists.");

                            var changed = !equal(old.value, value);
                            if (changed) {
                                if (value === undefined) {
                                    entries.remove(old);
                                    array.splice(i, 1);
                                    if (!array.length)
                                        delete buckets[hash];
                                    --_._count;
                                } else {
                                    entry = new HashEntry(key, value);
                                    entries.replace(old, entry);
                                    array[i] = entry;
                                }

                                _._onValueUpdate(key, value, old.value);
                            }
                            return changed;
                        }
                    }
                    array.push(entry = entry || new HashEntry(key, value));
                } else {
                    if (value === undefined) {
                        if (allowOverwrite)
                            return false;
                        else
                            throw new Error("Cannot add 'undefined' value.");
                    }
                    buckets[hash] = [entry = new HashEntry(key, value)];
                }
                ++_._count;
                entries.addLast(entry);
                _._onValueUpdate(key, value, undefined);
                return true;
            };

            Dictionary.prototype.addByKeyValue = function (key, value) {
                this.setKV(key, value, false);
            };

            Dictionary.prototype.get = function (key) {
                var buckets = this._buckets, comparer = this.compareSelector;
                var compareKey = comparer(key);
                var hash = computeHashCode(compareKey);
                if (!callHasOwnProperty(buckets, hash))
                    return undefined;

                var array = buckets[hash];
                for (var i = 0, len = array.length; i < len; i++) {
                    var entry = array[i];
                    if (comparer(entry.key) === compareKey)
                        return entry.value;
                }
                return undefined;
            };

            Dictionary.prototype.set = function (key, value) {
                return this.setKV(key, value, true);
            };

            Dictionary.prototype.containsKey = function (key) {
                var _ = this, buckets = _._buckets, comparer = _.compareSelector;
                var compareKey = comparer(key);
                var hash = computeHashCode(compareKey);
                if (!callHasOwnProperty(buckets, hash))
                    return false;

                var array = buckets[hash];
                for (var i = 0, len = array.length; i < len; i++)
                    if (comparer(array[i].key) === compareKey)
                        return true;

                return false;
            };

            Dictionary.prototype.clear = function () {
                var _ = this, buckets = _._buckets, count = _super.prototype.clear.call(this);

                _._count = 0;
                for (var key in buckets)
                    if (buckets.hasOwnProperty(key))
                        delete buckets[key];

                _._entries.clear();

                return count;
            };

            Object.defineProperty(Dictionary.prototype, "count", {
                get: function () {
                    return this._count;
                },
                enumerable: true,
                configurable: true
            });

            Dictionary.prototype.getEnumerator = function () {
                var _ = this, currentEntry;

                return new Collections.EnumeratorBase(function () {
                    currentEntry = _._entries.first;
                }, function (yielder) {
                    if (currentEntry != null) {
                        var result = { key: currentEntry.key, value: currentEntry.value };
                        currentEntry = currentEntry.next;
                        return yielder.yieldReturn(result);
                    }
                    return yielder.yieldBreak();
                });
            };

            Object.defineProperty(Dictionary.prototype, "keys", {
                get: function () {
                    var _ = this, result = [];
                    _._entries.forEach(function (entry) {
                        return result.push(entry.key);
                    });
                    return result;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Dictionary.prototype, "values", {
                get: function () {
                    var _ = this, result = [];
                    _._entries.forEach(function (entry) {
                        return result.push(entry.value);
                    });
                    return result;
                },
                enumerable: true,
                configurable: true
            });
            return Dictionary;
        })(Collections.DictionaryAbstractBase);
        Collections.Dictionary = Dictionary;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var System;
(function (System) {
    (function (Collections) {
        var StringKeyDictionary = (function (_super) {
            __extends(StringKeyDictionary, _super);
            function StringKeyDictionary() {
                _super.apply(this, arguments);
                this._count = 0;
                this._map = {};
            }
            StringKeyDictionary.prototype.containsKey = function (key) {
                return key in this._map;
            };

            StringKeyDictionary.prototype.containsValue = function (value) {
                var map = this._map, equal = System.areEqual;
                for (var key in map)
                    if (map.hasOwnProperty(key) && equal(map[key], value))
                        return true;
                return false;
            };

            StringKeyDictionary.prototype.get = function (key) {
                return this._map[key];
            };

            StringKeyDictionary.prototype.set = function (key, value) {
                var _ = this, map = _._map, old = map[key];
                if (old !== value) {
                    if (value === undefined) {
                        if (key in map) {
                            delete map[key];
                            --_._count;
                        }
                    } else {
                        if (!(key in map))
                            ++_._count;
                        map[key] = value;
                    }

                    _._onValueUpdate(key, value, old);
                    return true;
                }
                return false;
            };

            StringKeyDictionary.prototype.importMap = function (values) {
                var _ = this;
                return _.handleUpdate(function () {
                    var changed = false;
                    for (var key in values) {
                        if (values.hasOwnProperty(key) && _.set(key, values[key]))
                            changed = true;
                    }
                    return changed;
                });
            };

            StringKeyDictionary.prototype.toMap = function (selector) {
                var _ = this, result = {};
                for (var key in _._map) {
                    if (_._map.hasOwnProperty(key)) {
                        var value = _._map[key];
                        if (selector)
                            value = selector(key, value);
                        if (value !== undefined)
                            result[key] = value;
                    }
                }
                return result;
            };

            Object.defineProperty(StringKeyDictionary.prototype, "keys", {
                get: function () {
                    var _ = this, result = [];
                    for (var key in _._map)
                        if (_._map.hasOwnProperty(key))
                            result.push(key);

                    return result;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StringKeyDictionary.prototype, "values", {
                get: function () {
                    var _ = this, result = [];
                    for (var key in _._map)
                        if (_._map.hasOwnProperty(key))
                            result.push(_._map[key]);

                    return result;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StringKeyDictionary.prototype, "count", {
                get: function () {
                    return this._count;
                },
                enumerable: true,
                configurable: true
            });
            return StringKeyDictionary;
        })(Collections.DictionaryAbstractBase);
        Collections.StringKeyDictionary = StringKeyDictionary;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var System;
(function (System) {
    (function (Collections) {
        var OrderedStringKeyDictionary = (function (_super) {
            __extends(OrderedStringKeyDictionary, _super);
            function OrderedStringKeyDictionary() {
                _super.call(this);
                this._order = [];
            }
            OrderedStringKeyDictionary.prototype.indexOfKey = function (key) {
                return this._order.indexOf(key, 0);
            };

            OrderedStringKeyDictionary.prototype.getValueByIndex = function (index) {
                return this.get(this._order[index]);
            };

            OrderedStringKeyDictionary.prototype.set = function (key, value, keepIndex) {
                var _ = this, exists = _.indexOfKey(key) != -1;
                if (!exists && (value !== undefined || keepIndex))
                    _._order.push(key);
                else if (exists && value === undefined && !keepIndex)
                    Collections.ArrayUtility.remove(_._order, key);

                return _super.prototype.set.call(this, key, value);
            };

            OrderedStringKeyDictionary.prototype.setByIndex = function (index, value) {
                var _ = this, order = _._order;
                if (index < 0 || index >= order.length)
                    throw new Error("IndexOutOfRange Exception.");

                return _.set(order[index], value);
            };

            OrderedStringKeyDictionary.prototype.importValues = function (values) {
                var _ = this;
                return _.handleUpdate(function () {
                    var changed = false;
                    for (var i = 0; i < values.length; i++)
                        if (_.setByIndex(i, values[i]))
                            changed = true;
                    return changed;
                });
            };

            OrderedStringKeyDictionary.prototype.setValues = function () {
                var values = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    values[_i] = arguments[_i + 0];
                }
                return this.importValues(values);
            };

            OrderedStringKeyDictionary.prototype.removeByIndex = function (index) {
                return this.setByIndex(index, undefined);
            };

            Object.defineProperty(OrderedStringKeyDictionary.prototype, "keys", {
                get: function () {
                    var _ = this;
                    return _._order.filter(function (key) {
                        return _.containsKey(key);
                    });
                },
                enumerable: true,
                configurable: true
            });
            return OrderedStringKeyDictionary;
        })(Collections.StringKeyDictionary);
        Collections.OrderedStringKeyDictionary = OrderedStringKeyDictionary;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
})(System || (System = {}));
var LinkedList = System.Collections.LinkedList;

var System;
(function (System) {
    (function (Text) {
        var Types = new System.Types();

        var StringBuilder = (function () {
            function StringBuilder() {
                var initial = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    initial[_i] = arguments[_i + 0];
                }
                var _ = this;
                _._latest = null;
                _._partArray = [];
                _.appendThese(initial);
            }
            StringBuilder.prototype.appendSingle = function (item) {
                if (item !== null && item !== undefined) {
                    var _ = this;
                    _._latest = null;
                    switch (typeof item) {
                        case Types.Object:
                        case Types.Function:
                            item = item.toString();
                            break;
                    }
                    _._partArray.push(item);
                }
            };

            StringBuilder.prototype.appendThese = function (items) {
                var _ = this;
                items.forEach(function (s) {
                    return _.appendSingle(s);
                });
                return _;
            };

            StringBuilder.prototype.append = function () {
                var items = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    items[_i] = arguments[_i + 0];
                }
                this.appendThese(items);
                return this;
            };

            StringBuilder.prototype.appendLine = function () {
                var items = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    items[_i] = arguments[_i + 0];
                }
                this.appendLines(items);
                return this;
            };

            StringBuilder.prototype.appendLines = function (items) {
                var _ = this;
                items.forEach(function (i) {
                    if (i !== null && i !== undefined) {
                        _.appendSingle(i);
                        _._partArray.push("\r\n");
                    }
                });
                return _;
            };

            Object.defineProperty(StringBuilder.prototype, "isEmpty", {
                get: function () {
                    return this._partArray.length === 0;
                },
                enumerable: true,
                configurable: true
            });

            StringBuilder.prototype.toString = function () {
                var latest = this._latest;
                if (!latest === null)
                    this._latest = latest = this._partArray.join();

                return latest;
            };

            StringBuilder.prototype.join = function (delimiter) {
                return this._partArray.join(delimiter);
            };

            StringBuilder.prototype.clear = function () {
                this._partArray.length = 0;
                this._latest = null;
            };

            StringBuilder.prototype.dispose = function () {
                this.clear();
            };
            return StringBuilder;
        })();
        Text.StringBuilder = StringBuilder;
    })(System.Text || (System.Text = {}));
    var Text = System.Text;
})(System || (System = {}));
//# sourceMappingURL=System.js.map
