"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Origin: http://www.fallingcanbedeadly.com/
 * Licensing: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ReadOnlyCollectionBase_1 = require("./ReadOnlyCollectionBase");
var ArgumentOutOfRangeException_1 = require("../Exceptions/ArgumentOutOfRangeException");
var EnumeratorBase_1 = require("./Enumeration/EnumeratorBase");
var extends_1 = require("../../extends");
var Integer_1 = require("../Integer");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var LazyList = /** @class */ (function (_super) {
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
exports.LazyList = LazyList;
//# sourceMappingURL=LazyList.js.map