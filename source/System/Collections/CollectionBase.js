/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Enumeration/Enumerator", "../Compare", "../Exceptions/ArgumentNullException", "../Exceptions/InvalidOperationException", "../Disposable/DisposableBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Enumerator_1 = require("./Enumeration/Enumerator");
    var Compare_1 = require("../Compare");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var NAME = "CollectionBase", CMDC = "Cannot modify a disposed collection.", CMRO = "Cannot modify a read-only collection.";
    var CollectionBase = (function (_super) {
        __extends(CollectionBase, _super);
        function CollectionBase(source, _equalityComparer) {
            if (_equalityComparer === void 0) { _equalityComparer = Compare_1.areEqual; }
            _super.call(this);
            this._equalityComparer = _equalityComparer;
            this._disposableObjectName = NAME;
            this._importEntries(source);
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
                throw new InvalidOperationException_1.default(CMRO);
        };
        CollectionBase.prototype._onModified = function () { };
        CollectionBase.prototype.add = function (entry) {
            this.assertModifiable();
            if (this._addInternal(entry))
                this._onModified();
        };
        CollectionBase.prototype.remove = function (entry, max) {
            if (max === void 0) { max = Infinity; }
            this.assertModifiable();
            var n = this._removeInternal(entry, max);
            if (n)
                this._onModified();
            return n;
        };
        CollectionBase.prototype.clear = function () {
            this.assertModifiable();
            var n = this._clearInternal();
            if (n)
                this._onModified();
            return n;
        };
        CollectionBase.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._clearInternal();
        };
        CollectionBase.prototype._importEntries = function (entries) {
            var _this = this;
            var added = false;
            if (entries) {
                Enumerator_1.forEach(entries, function (e) {
                    if (_this._addInternal(e))
                        added = true;
                });
            }
            return added;
        };
        CollectionBase.prototype.importEntries = function (entries) {
            this.assertModifiable();
            var added = this._importEntries(entries);
            if (added)
                this._onModified();
            return added;
        };
        CollectionBase.prototype.contains = function (entry) {
            if (!this.getCount())
                return false;
            var found = false, equals = this._equalityComparer;
            this.forEach(function (e) { return !(found = equals(entry, e)); });
            return found;
        };
        CollectionBase.prototype.forEach = function (action, useCopy) {
            if (useCopy) {
                var a = this.toArray();
                Enumerator_1.forEach(a, action);
                a.length = 0;
            }
            else {
                Enumerator_1.forEach(this.getEnumerator(), action);
            }
        };
        CollectionBase.prototype.copyTo = function (target, index) {
            if (index === void 0) { index = 0; }
            if (!target)
                throw new ArgumentNullException_1.default('target');
            var count = this.getCount(), newLength = count + index;
            if (target.length < newLength)
                target.length = newLength;
            Enumerator_1.forEach(this.getEnumerator(), function (e, i) {
                target[i] = e;
            });
            return target;
        };
        CollectionBase.prototype.toArray = function () {
            var count = this.getCount();
            return this.copyTo(count > 65536 ? new Array(count) : []);
        };
        return CollectionBase;
    }(DisposableBase_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CollectionBase;
});
//# sourceMappingURL=CollectionBase.js.map