(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./Enumeration/Enumerator", "../Compare", "../Exceptions/ArgumentNullException", "../Exceptions/InvalidOperationException", "../Disposable/DisposableBase", "../Environment", "../../extends"], function (require, exports) {
    "use strict";
    var Enumerator_1 = require("./Enumeration/Enumerator");
    var Compare_1 = require("../Compare");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var Environment_1 = require("../Environment");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var NAME = "CollectionBase", CMDC = "Cannot modify a disposed collection.", CMRO = "Cannot modify a read-only collection.";
    var LINQ_PATH = "../../System.Linq/Linq";
    var CollectionBase = (function (_super) {
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
                    console.error(ex);
                }
                return true;
            }
            return false;
        };
        CollectionBase.prototype._incrementModified = function () { this._modifiedCount++; };
        Object.defineProperty(CollectionBase.prototype, "isUpdating", {
            get: function () { return this._updateRecursion != 0; },
            enumerable: true,
            configurable: true
        });
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
        CollectionBase.prototype.some = function (predicate) {
            return this.any(predicate);
        };
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
        CollectionBase.prototype.toArray = function () {
            var count = this.getCount();
            return count
                ? this.copyTo(count > 65536 ? new Array(count) : [])
                : [];
        };
        Object.defineProperty(CollectionBase.prototype, "linq", {
            get: function () {
                this.throwIfDisposed();
                var e = this._linq;
                if (!e) {
                    if (!Environment_1.isNodeJS || !Environment_1.isCommonJS)
                        throw "using .linq to load and initialize a ILinqEnumerable is currently only supported within a NodeJS environment.\nImport System.Linq/Linq and use Enumerable.from(e) instead.\nOr use .linqAsync(callback) for AMD/RequireJS.";
                    this._linq = e = eval("require")(LINQ_PATH).default.from(this);
                    if (!e)
                        throw "There was a problem importing System.Linq/Linq";
                }
                return e;
            },
            enumerable: true,
            configurable: true
        });
        CollectionBase.prototype.linqAsync = function (callback) {
            var _this = this;
            this.throwIfDisposed();
            var e = this._linq;
            if (!e) {
                if (Environment_1.isRequireJS) {
                    eval("require")([LINQ_PATH], function (linq) {
                        e = _this._linq;
                        if (!e)
                            _this._linq = e = linq.default.from(_this);
                        if (!e)
                            throw "There was a problem importing System.Linq/Linq";
                        if (callback)
                            callback(e);
                        callback = void 0;
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
    exports.CollectionBase = CollectionBase;
});
//# sourceMappingURL=CollectionBase.js.map