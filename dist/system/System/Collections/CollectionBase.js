System.register(["./Enumeration/Enumerator", "../Compare", "../Exceptions/ArgumentNullException", "../Exceptions/InvalidOperationException", "../Disposable/DisposableBase", "../Environment", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Enumerator_1, Compare_1, ArgumentNullException_1, InvalidOperationException_1, DisposableBase_1, Environment_1, extends_1, __extends, NAME, CMDC, CMRO, LINQ_PATH, CollectionBase;
    return {
        setters: [
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            },
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (InvalidOperationException_1_1) {
                InvalidOperationException_1 = InvalidOperationException_1_1;
            },
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (Environment_1_1) {
                Environment_1 = Environment_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {
            //noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            //noinspection SpellCheckingInspection
            NAME = "CollectionBase", CMDC = "Cannot modify a disposed collection.", CMRO = "Cannot modify a read-only collection.";
            LINQ_PATH = "../../System.Linq/Linq";
            CollectionBase = (function (_super) {
                __extends(CollectionBase, _super);
                function CollectionBase(source, _equalityComparer) {
                    if (_equalityComparer === void 0) { _equalityComparer = Compare_1.areEqual; }
                    var _this = _super.call(this) || this;
                    _this._equalityComparer = _equalityComparer;
                    var _ = _this;
                    _._disposableObjectName = NAME;
                    _._importEntries(source);
                    _._updateRecursion = 0;
                    _._modifiedCount = 0;
                    _._version = 0;
                    return _this;
                }
                Object.defineProperty(CollectionBase.prototype, "count", {
                    get: function () {
                        return this.getCount();
                    },
                    enumerable: true,
                    configurable: true
                });
                CollectionBase.prototype.getIsReadOnly = function () {
                    return false;
                };
                Object.defineProperty(CollectionBase.prototype, "isReadOnly", {
                    //noinspection JSUnusedGlobalSymbols
                    get: function () {
                        return this.getIsReadOnly();
                    },
                    enumerable: true,
                    configurable: true
                });
                CollectionBase.prototype.assertModifiable = function () {
                    this.throwIfDisposed(CMDC);
                    if (this.getIsReadOnly())
                        throw new InvalidOperationException_1.InvalidOperationException(CMRO);
                    return true;
                };
                CollectionBase.prototype.assertVersion = function (version) {
                    if (version !== this._version)
                        throw new InvalidOperationException_1.InvalidOperationException("Collection was modified.");
                    return true;
                };
                CollectionBase.prototype._onModified = function () { };
                CollectionBase.prototype._signalModification = function (increment) {
                    var _ = this;
                    if (increment)
                        _._modifiedCount++;
                    if (_._modifiedCount && !this._updateRecursion) {
                        _._modifiedCount = 0;
                        _._version++;
                        try {
                            _._onModified();
                        }
                        catch (ex) {
                            // Avoid fatal errors which may have been caused by consumer.
                            console.error(ex);
                        }
                        return true;
                    }
                    return false;
                };
                CollectionBase.prototype._incrementModified = function () { this._modifiedCount++; };
                Object.defineProperty(CollectionBase.prototype, "isUpdating", {
                    //noinspection JSUnusedGlobalSymbols
                    get: function () { return this._updateRecursion != 0; },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Takes a closure that if returning true will propagate an update signal.
                 * Multiple update operations can be occurring at once or recursively and the onModified signal will only occur once they're done.
                 * @param closure
                 * @returns {boolean}
                 */
                CollectionBase.prototype.handleUpdate = function (closure) {
                    if (!closure)
                        return false;
                    var _ = this;
                    _.assertModifiable();
                    _._updateRecursion++;
                    var updated = false;
                    try {
                        if (updated = closure())
                            _._modifiedCount++;
                    }
                    finally {
                        _._updateRecursion--;
                    }
                    _._signalModification();
                    return updated;
                };
                /*
                 * Note: for a slight amount more code, we avoid creating functions/closures.
                 * Calling handleUpdate is the correct pattern, but if possible avoid creating another function scope.
                 */
                /**
                 * Adds an entry to the collection.
                 * @param entry
                 */
                CollectionBase.prototype.add = function (entry) {
                    var _ = this;
                    _.assertModifiable();
                    _._updateRecursion++;
                    try {
                        if (_._addInternal(entry))
                            _._modifiedCount++;
                    }
                    finally {
                        _._updateRecursion--;
                    }
                    _._signalModification();
                };
                /**
                 * Removes entries from the collection allowing for a limit.
                 * For example if the collection not a distinct set, more than one entry could be removed.
                 * @param entry The entry to remove.
                 * @param max Limit of entries to remove.  Will remove all matches if no max specified.
                 * @returns {number} The number of entries removed.
                 */
                CollectionBase.prototype.remove = function (entry, max) {
                    if (max === void 0) { max = Infinity; }
                    var _ = this;
                    _.assertModifiable();
                    _._updateRecursion++;
                    var n = NaN;
                    try {
                        if (n = _._removeInternal(entry, max))
                            _._modifiedCount++;
                    }
                    finally {
                        _._updateRecursion--;
                    }
                    _._signalModification();
                    return n;
                };
                /**
                 * Clears the contents of the collection resulting in a count of zero.
                 * @returns {number}
                 */
                CollectionBase.prototype.clear = function () {
                    var _ = this;
                    _.assertModifiable();
                    _._updateRecursion++;
                    var n = NaN;
                    try {
                        if (n = _._clearInternal())
                            _._modifiedCount++;
                    }
                    finally {
                        _._updateRecursion--;
                    }
                    _._signalModification();
                    return n;
                };
                CollectionBase.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this._clearInternal();
                    this._version = 0;
                    this._updateRecursion = 0;
                    this._modifiedCount = 0;
                    var l = this._linq;
                    this._linq = void 0;
                    if (l)
                        l.dispose();
                };
                CollectionBase.prototype._importEntries = function (entries) {
                    var _this = this;
                    var added = 0;
                    if (entries) {
                        if ((entries) instanceof (Array)) {
                            // Optimize for avoiding a new closure.
                            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                                var e = entries_1[_i];
                                if (this._addInternal(e))
                                    added++;
                            }
                        }
                        else {
                            Enumerator_1.forEach(entries, function (e) {
                                if (_this._addInternal(e))
                                    added++;
                            });
                        }
                    }
                    return added;
                };
                /**
                 * Safely imports any array enumerator, or enumerable.
                 * @param entries
                 * @returns {number}
                 */
                CollectionBase.prototype.importEntries = function (entries) {
                    var _ = this;
                    if (!entries)
                        return 0;
                    _.assertModifiable();
                    _._updateRecursion++;
                    var n = NaN;
                    try {
                        if (n = _._importEntries(entries))
                            _._modifiedCount++;
                    }
                    finally {
                        _._updateRecursion--;
                    }
                    _._signalModification();
                    return n;
                };
                /**
                 * Returns an array filtered by the provided predicate.
                 * Provided for similarity to JS Array.
                 * @param predicate
                 * @returns {T[]}
                 */
                CollectionBase.prototype.filter = function (predicate) {
                    if (!predicate)
                        throw new ArgumentNullException_1.ArgumentNullException('predicate');
                    var count = !this.getCount();
                    var result = [];
                    if (count) {
                        this.forEach(function (e, i) {
                            if (predicate(e, i))
                                result.push(e);
                        });
                    }
                    return result;
                };
                /**
                 * Returns true the first time predicate returns true.  Otherwise false.
                 * Useful for searching through a collection.
                 * @param predicate
                 * @returns {any}
                 */
                CollectionBase.prototype.any = function (predicate) {
                    var count = this.getCount();
                    if (!count)
                        return false;
                    if (!predicate)
                        return Boolean(count);
                    var found = false;
                    this.forEach(function (e, i) { return !(found = predicate(e, i)); });
                    return found;
                };
                /**
                 * Returns true the first time predicate returns true.  Otherwise false.
                 * See '.any(predicate)'.  As this method is just just included to have similarity with a JS Array.
                 * @param predicate
                 * @returns {any}
                 */
                CollectionBase.prototype.some = function (predicate) {
                    return this.any(predicate);
                };
                /**
                 * Returns true if the equality comparer resolves true on any element in the collection.
                 * @param entry
                 * @returns {boolean}
                 */
                CollectionBase.prototype.contains = function (entry) {
                    var equals = this._equalityComparer;
                    return this.any(function (e) { return equals(entry, e); });
                };
                CollectionBase.prototype.forEach = function (action, useCopy) {
                    if (this.wasDisposed)
                        return 0;
                    if (useCopy) {
                        var a = this.toArray();
                        try {
                            return Enumerator_1.forEach(a, action);
                        }
                        finally {
                            a.length = 0;
                        }
                    }
                    else {
                        return Enumerator_1.forEach(this.getEnumerator(), action);
                    }
                };
                /**
                 * Copies all values to numerically indexable object.
                 * @param target
                 * @param index
                 * @returns {TTarget}
                 */
                CollectionBase.prototype.copyTo = function (target, index) {
                    if (index === void 0) { index = 0; }
                    if (!target)
                        throw new ArgumentNullException_1.ArgumentNullException('target');
                    var count = this.getCount();
                    if (count) {
                        var newLength = count + index;
                        if (target.length < newLength)
                            target.length = newLength;
                        var e = this.getEnumerator();
                        while (e.moveNext()) {
                            target[index++] = e.current;
                        }
                    }
                    return target;
                };
                /**
                 * Returns an array of the collection contents.
                 * @returns {any[]|Array}
                 */
                CollectionBase.prototype.toArray = function () {
                    var count = this.getCount();
                    return count
                        ? this.copyTo(count > 65536 ? new Array(count) : [])
                        : [];
                };
                Object.defineProperty(CollectionBase.prototype, "linq", {
                    /**
                     * .linq will return an ILinqEnumerable if .linqAsync() has completed successfully or the default module loader is NodeJS+CommonJS.
                     * @returns {ILinqEnumerable}
                     */
                    get: function () {
                        this.throwIfDisposed();
                        var e = this._linq;
                        if (!e) {
                            var r = void 0;
                            try {
                                r = eval('require');
                            }
                            catch (ex) { }
                            this._linq = e = r && r(LINQ_PATH).default.from(this);
                            if (!e) {
                                throw Environment_1.isRequireJS
                                    ? "using .linq to load and initialize a ILinqEnumerable is currently only supported within a NodeJS environment.\nImport System.Linq/Linq and use Enumerable.from(e) instead.\nYou can also preload the Linq module as a dependency or use .linqAsync(callback) for AMD/RequireJS."
                                    : "There was a problem importing System.Linq/Linq";
                            }
                        }
                        return e;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * .linqAsync() is for use with deferred loading.
                 * Ensures an instance of the Linq extensions is available and then passes it to the callback.
                 * Returns an ILinqEnumerable if one is already available, otherwise undefined.
                 * Passing no parameters will still initiate loading and initializing the ILinqEnumerable which can be useful for pre-loading.
                 * Any call to .linqAsync() where an ILinqEnumerable is returned can be assured that any subsequent calls to .linq will return the same instance.
                 * @param callback
                 * @returns {ILinqEnumerable}
                 */
                CollectionBase.prototype.linqAsync = function (callback) {
                    var _this = this;
                    this.throwIfDisposed();
                    var e = this._linq;
                    if (!e) {
                        if (Environment_1.isRequireJS) {
                            eval("require")([LINQ_PATH], function (linq) {
                                // Could end up being called more than once, be sure to check for ._linq before setting...
                                e = _this._linq;
                                if (!e)
                                    _this._linq = e = linq.default.from(_this);
                                if (!e)
                                    throw "There was a problem importing System.Linq/Linq";
                                if (callback)
                                    callback(e);
                                callback = void 0; // In case this is return synchronously..
                            });
                        }
                        else if (Environment_1.isNodeJS && Environment_1.isCommonJS) {
                            e = this.linq;
                        }
                        else {
                            throw "Cannot find a compatible loader for importing System.Linq/Linq";
                        }
                    }
                    if (e && callback)
                        callback(e);
                    return e;
                };
                return CollectionBase;
            }(DisposableBase_1.DisposableBase));
            exports_1("CollectionBase", CollectionBase);
        }
    };
});
//# sourceMappingURL=CollectionBase.js.map