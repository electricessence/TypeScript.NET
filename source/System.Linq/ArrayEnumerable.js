/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../System/System', '../System/Functions', '../System/Collections/Arrays/Utility', '../System/Collections/Enumeration/ArrayEnumerator', './Enumerable'], function (require, exports, System, Functions, ArrayUtility, ArrayEnumerator, Enumerable) {
    'use strict';
    var INT_0 = 0 | 0, INT_NEGATIVE_1 = -1 | 0, INT_POSITIVE_1 = +1 | 0;
    var ArrayEnumerable = (function (_super) {
        __extends(ArrayEnumerable, _super);
        function ArrayEnumerable(source) {
            var _ = this;
            _._source = source;
            _super.call(this, function () {
                _.assertIsNotDisposed();
                return new ArrayEnumerator(function () {
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
            get: function () { return this._source; },
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
            _.assertIsNotDisposed();
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
            return (index < source.length && index >= 0)
                ? source[index]
                : _super.prototype.elementAt.call(this, index);
        };
        ArrayEnumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            var _ = this;
            _.assertIsNotDisposed();
            var source = _._source;
            return (index < source.length && index >= 0)
                ? source[index]
                : defaultValue;
        };
        ArrayEnumerable.prototype.first = function () {
            var _ = this;
            _.assertIsNotDisposed();
            var source = _._source;
            return (source && source.length)
                ? source[0]
                : _super.prototype.first.call(this);
        };
        ArrayEnumerable.prototype.firstOrDefault = function (defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            var _ = this;
            _.assertIsNotDisposed();
            var source = _._source;
            return (source && source.length)
                ? source[0]
                : defaultValue;
        };
        ArrayEnumerable.prototype.last = function () {
            var _ = this;
            _.assertIsNotDisposed();
            var source = _._source, len = source.length;
            return (len)
                ? source[len - 1]
                : _super.prototype.last.call(this);
        };
        ArrayEnumerable.prototype.lastOrDefault = function (defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            var _ = this;
            _.assertIsNotDisposed();
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
            var _ = this, len = _._source ? _._source.length : 0;
            return _.skip(len - count);
        };
        ArrayEnumerable.prototype.reverse = function () {
            var _ = this;
            return new Enumerable(function () { return new ArrayEnumerator(function () { return _._source; }, _._source ? (_._source.length - 1) : 0, -1); });
        };
        ArrayEnumerable.prototype.memoize = function () {
            return new ArrayEnumerable(this._source);
        };
        ArrayEnumerable.prototype.sequenceEqual = function (second, equalityComparer) {
            if (equalityComparer === void 0) { equalityComparer = System.areEqual; }
            if (second instanceof Array)
                return ArrayUtility.areEqual(this.source, second, true, equalityComparer);
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
    return ArrayEnumerable;
});
//# sourceMappingURL=ArrayEnumerable.js.map