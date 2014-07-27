var System;
(function (System) {
    (function (Collections) {
        (function (ArrayUtility) {
            function copy(array) {
                return array ? array.slice() : array;
            }
            ArrayUtility.copy = copy;

            function contains(array, item) {
                return !array ? false : array.indexOf(item) != -1;
            }
            ArrayUtility.contains = contains;

            function replace(array, old, newValue, max) {
                var count = 0;
                if (max !== 0) {
                    if (!max)
                        max = Infinity;

                    for (var i = array.length - 1; i >= 0; --i)
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

            function register(array, item) {
                var ok = array && (!array.length || !contains(array, item));
                if (ok)
                    array.push(item);
                return ok;
            }
            ArrayUtility.register = register;

            function findIndex(array, predicate) {
                var len = array.length;
                for (var i = 0; i < len; ++i)
                    if (i in array && predicate(array[i]))
                        return i;

                return -1;
            }
            ArrayUtility.findIndex = findIndex;

            function areAllEqual(arrays, strict) {
                if (arrays.length < 2)
                    throw new Error("Cannot compare a set of arrays less than 2.");
                var first = arrays[0];
                for (var i = 0, l = arrays.length; i < l; ++i) {
                    if (!areEqual(first, arrays[i], strict))
                        return false;
                }
                return true;
            }
            ArrayUtility.areAllEqual = areAllEqual;

            function areEqual(a, b, strict) {
                if (a === b)
                    return true;

                var len = a.length;
                if (len != b.length)
                    return false;

                var equal = System.areEqual;

                for (var i = 0; i < len; ++i)
                    if (!equal(a[i], b[i], strict))
                        return false;

                return true;
            }
            ArrayUtility.areEqual = areEqual;

            function applyTo(target, fn) {
                for (var i = 0; i < target.length; ++i)
                    target[i] = fn(target[i]);
                return target;
            }
            ArrayUtility.applyTo = applyTo;

            function removeIndex(array, index) {
                var exists = index < array.length;
                if (exists)
                    array.splice(index, 1);
                return exists;
            }
            ArrayUtility.removeIndex = removeIndex;

            function remove(array, value, max) {
                var count = 0;
                if (array && array.length && max !== 0) {
                    if (!max)
                        max = Infinity;

                    for (var i = array.length - 1; i >= 0; --i)
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
        })(Collections.ArrayUtility || (Collections.ArrayUtility = {}));
        var ArrayUtility = Collections.ArrayUtility;
    })(System.Collections || (System.Collections = {}));
    var Collections = System.Collections;
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
                var _ = this, buckets = _._buckets, entries = _._entries, compare = _.compareSelector;
                var compareKey = compare(key);
                var hash = computeHashCode(compareKey), entry;

                if (callHasOwnProperty(buckets, hash)) {
                    var equal = System.areEqual;
                    var array = buckets[hash];
                    for (var i = 0; i < array.length; i++) {
                        var old = array[i];
                        if (compare(old.key) === compareKey) {
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
                var _ = this, buckets = _._buckets, compare = _.compareSelector;
                var compareKey = compare(key);
                var hash = computeHashCode(compareKey);
                if (!callHasOwnProperty(buckets, hash))
                    return undefined;

                var array = buckets[hash];
                for (var i = 0, len = array.length; i < len; i++) {
                    var entry = array[i];
                    if (compare(entry.key) === compareKey)
                        return entry.value;
                }
                return undefined;
            };

            Dictionary.prototype.set = function (key, value) {
                return this.setKV(key, value, true);
            };

            Dictionary.prototype.containsKey = function (key) {
                var _ = this, buckets = _._buckets, compare = _.compareSelector;
                var compareKey = compare(key);
                var hash = computeHashCode(compareKey);
                if (!callHasOwnProperty(buckets, hash))
                    return false;

                var array = buckets[hash];
                for (var i = 0, len = array.length; i < len; i++)
                    if (compare(array[i].key) === compareKey)
                        return true;

                return false;
            };

            Dictionary.prototype.clear = function () {
                var _ = this, buckets = _._buckets, count = _super.prototype.clear.call(this);

                _._count = 0;
                for (var key in buckets)
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
        var DictionaryAbstractBase = (function () {
            function DictionaryAbstractBase() {
                this._updateRecursion = 0;
            }
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
                    throw new Error("Not implemented.");
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
                    throw new Error("Not implemented.");
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DictionaryAbstractBase.prototype, "values", {
                get: function () {
                    throw new Error("Not implemented.");
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
                throw new Error("Not implemented.");
            };

            DictionaryAbstractBase.prototype.set = function (key, value) {
                throw new Error("Not implemented.");
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
                }, function (yielder) {
                    var current = source.pointer++;
                    return current < length ? yielder.yieldReturn(source.source[current]) : yielder.yieldBreak();
                }, function () {
                    source.source = null;
                    source = null;
                });
            }
            return IndexEnumerator;
        })(EnumeratorBase);
        Collections.IndexEnumerator = IndexEnumerator;

        var ArrayEnumerator = (function (_super) {
            __extends(ArrayEnumerator, _super);
            function ArrayEnumerator(arrayFactory, start) {
                if (typeof start === "undefined") { start = 0; }
                _super.call(this, function () {
                    var array = arrayFactory();
                    return { source: array, pointer: start, length: array.length };
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
        var OrderedStringKeyDictionary = (function (_super) {
            __extends(OrderedStringKeyDictionary, _super);
            function OrderedStringKeyDictionary() {
                _super.call(this);
                this._order = [];
            }
            OrderedStringKeyDictionary.prototype.indexOfKey = function (key) {
                return this._order.indexOf(key);
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
    function dispose(obj) {
        if (obj && typeof obj.dispose == System.Types.Function)
            obj.dispose();
    }
    System.dispose = dispose;

    function using(disposable, closure) {
        try  {
            return closure(disposable);
        } finally {
            dispose(disposable);
        }
    }
    System.using = using;

    var DisposableBase = (function () {
        function DisposableBase() {
            this._wasDisposed = false;
        }
        Object.defineProperty(DisposableBase.prototype, "wasDisposed", {
            get: function () {
                return this._wasDisposed;
            },
            enumerable: true,
            configurable: true
        });

        DisposableBase.prototype.dispose = function () {
            if (!this._wasDisposed) {
                this._wasDisposed = true;
                this._onDispose();
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
            return;
            this.type == type && this.listener == listener && this.useCapture == useCapture;
        };

        EventDispatcherEntry.prototype.equals = function (other) {
            return;
            this.type == other.type && this.listener == other.listener && this.useCapture == other.useCapture && this.priority == other.priority;
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
            var listeners = this._listeners;
            if (!listeners)
                this._listeners = listeners = new Array();

            listeners.push(new EventDispatcherEntry(type, listener, useCapture, priority));
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
            var _ = this;
            var l = _._listeners;
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

            var entries = new Array(), propagate = true, prevent = false;
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

        Object.defineProperty(Lazy.prototype, "value", {
            get: function () {
                var _ = this;
                if (!_._isValueCreated && _._closure) {
                    var v = _._closure();
                    _._value = v;
                    _._isValueCreated = true;

                    _._closure = null;
                    return v;
                }

                return _._value;
            },
            enumerable: true,
            configurable: true
        });

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
    System.Functions = {
        Identity: function (x) {
            return x;
        },
        True: function () {
            return true;
        },
        False: function () {
            return false;
        },
        Blank: function () {
        }
    };

    System.Types = {
        Boolean: typeof true,
        Number: typeof 0,
        String: typeof "",
        Object: typeof {},
        Null: typeof null,
        Undefined: typeof undefined,
        Function: typeof function () {
        }
    };

    function isEqualToNaN(n) {
        return typeof n == System.Types.Number && isNaN(n);
    }
    System.isEqualToNaN = isEqualToNaN;

    function areEqual(a, b, strict) {
        if (typeof strict === "undefined") { strict = true; }
        return a === b || !strict && a == b || isEqualToNaN(a) && isEqualToNaN(b);
    }
    System.areEqual = areEqual;

    function compare(a, b, strict) {
        if (typeof strict === "undefined") { strict = true; }
        return areEqual(a, b, strict) ? 0 : (a > b) ? 1 : -1;
    }
    System.compare = compare;

    function clone(source, depth) {
        if (typeof depth === "undefined") { depth = 0; }
        if (depth < 0)
            return source;

        switch (typeof source) {
            case System.Types.Undefined:
            case System.Types.Null:
            case System.Types.String:
            case System.Types.Boolean:
            case System.Types.Number:
            case System.Types.Function:
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
//# sourceMappingURL=System.js.map
