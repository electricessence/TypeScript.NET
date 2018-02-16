/*!
 * @author electricessence / https://github.com/electricessence/
 * Origin: http://www.fallingcanbedeadly.com/
 * Licensing: MIT
 */
System.register(["./ReadOnlyCollectionBase", "../Exceptions/ArgumentOutOfRangeException", "./Enumeration/EnumeratorBase", "../../extends", "../Integer"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ReadOnlyCollectionBase_1, ArgumentOutOfRangeException_1, EnumeratorBase_1, extends_1, Integer_1, __extends, LazyList;
    return {
        setters: [
            function (ReadOnlyCollectionBase_1_1) {
                ReadOnlyCollectionBase_1 = ReadOnlyCollectionBase_1_1;
            },
            function (ArgumentOutOfRangeException_1_1) {
                ArgumentOutOfRangeException_1 = ArgumentOutOfRangeException_1_1;
            },
            function (EnumeratorBase_1_1) {
                EnumeratorBase_1 = EnumeratorBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            },
            function (Integer_1_1) {
                Integer_1 = Integer_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Origin: http://www.fallingcanbedeadly.com/
             * Licensing: MIT
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            LazyList = /** @class */ (function (_super) {
                __extends(LazyList, _super);
                function LazyList(source) {
                    var _this = _super.call(this) || this;
                    _this._enumerator = source.getEnumerator();
                    _this._cached = [];
                    return _this;
                }
                LazyList.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    var e = this._enumerator;
                    this._enumerator = null;
                    if (e)
                        e.dispose();
                    var c = this._cached;
                    this._cached = null;
                    if (c)
                        c.length = 0;
                };
                LazyList.prototype._getCount = function () {
                    this.finish();
                    var c = this._cached;
                    return c ? c.length : 0;
                };
                LazyList.prototype._getEnumerator = function () {
                    var _this = this;
                    var current;
                    return new EnumeratorBase_1.EnumeratorBase(function () {
                        current = 0;
                    }, function (yielder) {
                        _this.throwIfDisposed();
                        var c = _this._cached;
                        return (current < c.length || _this.getNext())
                            ? yielder.yieldReturn(c[current++])
                            : yielder.yieldBreak();
                    });
                };
                LazyList.prototype.get = function (index) {
                    this.throwIfDisposed();
                    Integer_1.Integer.assertZeroOrGreater(index);
                    var c = this._cached;
                    while (c.length <= index && this.getNext()) { }
                    if (index < c.length)
                        return c[index];
                    throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException("index", "Greater than total count.");
                };
                LazyList.prototype.indexOf = function (item) {
                    this.throwIfDisposed();
                    var c = this._cached;
                    var result = c.indexOf(item);
                    while (result == -1 && this.getNext(function (value) {
                        if (value == item)
                            result = c.length - 1;
                    })) { }
                    return result;
                };
                LazyList.prototype.contains = function (item) {
                    return this.indexOf(item) != -1;
                };
                LazyList.prototype.getNext = function (out) {
                    var e = this._enumerator;
                    if (!e)
                        return false;
                    if (e.moveNext()) {
                        var value = e.current;
                        this._cached.push(value);
                        if (out)
                            out(value);
                        return true;
                    }
                    else {
                        e.dispose();
                        this._enumerator = null;
                    }
                    return false;
                };
                LazyList.prototype.finish = function () {
                    while (this.getNext()) { }
                };
                return LazyList;
            }(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase));
            exports_1("LazyList", LazyList);
        }
    };
});
//# sourceMappingURL=LazyList.js.map