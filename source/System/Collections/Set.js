/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types", "./LinkedNodeList", "../Exceptions/ArgumentException", "../Exceptions/ArgumentNullException", "./Enumeration/Enumerator", "../Disposable/Utility"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var LinkedNodeList_1 = require("./LinkedNodeList");
    var ArgumentException_1 = require("../Exceptions/ArgumentException");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var Enumerator_1 = require("./Enumeration/Enumerator");
    var Utility_1 = require("../Disposable/Utility");
    var OTHER = 'other';
    var Set = (function () {
        function Set(source) {
            this._count = 0;
            if (source)
                this.unionWith(source);
        }
        Set.prototype._getSet = function () {
            var s = this._set;
            if (!s)
                this._set = s = new LinkedNodeList_1.default();
            return s;
        };
        Object.defineProperty(Set.prototype, "count", {
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Set.prototype, "isReadOnly", {
            get: function () { return true; },
            enumerable: true,
            configurable: true
        });
        Set.prototype.exceptWith = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            Enumerator_1.forEach(other, function (v) {
                _this.remove(v);
            });
        };
        Set.prototype.intersectWith = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            if (other instanceof Set) {
                var s = this._set;
                if (s)
                    s.forEach(function (n) {
                        if (!other.contains(n.value))
                            _this.remove(n.value);
                    });
            }
            else {
                Utility_1.using(new Set(other), function (o) { return _this.intersectWith(o); });
            }
        };
        Set.prototype.isProperSubsetOf = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            return other instanceof Set
                ? other.isProperSupersetOf(this)
                : Utility_1.using(new Set(other), function (o) { return o.isProperSupersetOf(_this); });
        };
        Set.prototype.isProperSupersetOf = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            var result = true, count;
            if (other instanceof Set) {
                result = this.isSupersetOf(other);
                count = other._count;
            }
            else {
                Utility_1.using(new Set(), function (o) {
                    Enumerator_1.forEach(other, function (v) {
                        o.add(v);
                        return result = _this.contains(v);
                    });
                    count = o._count;
                });
            }
            return result && this._count > count;
        };
        Set.prototype.isSubsetOf = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            return other instanceof Set
                ? other.isSupersetOf(this)
                : Utility_1.using(new Set(other), function (o) { return o.isSupersetOf(_this); });
        };
        Set.prototype.isSupersetOf = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            var result = true;
            Enumerator_1.forEach(other, function (v) {
                return result = _this.contains(v);
            });
            return result;
        };
        Set.prototype.overlaps = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            var result = false;
            Enumerator_1.forEach(other, function (v) { return !(result = _this.contains(v)); });
            return result;
        };
        Set.prototype.setEquals = function (other) {
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            return this._count == (other instanceof Set
                ? other._count
                : Utility_1.using(new Set(other), function (o) { return o._count; }))
                && this.isSubsetOf(other);
        };
        Set.prototype.symmetricExceptWith = function (other) {
            var _this = this;
            if (!other)
                throw new ArgumentNullException_1.default(OTHER);
            if (other instanceof Set) {
                Enumerator_1.forEach(other, function (v) {
                    if (_this.contains(v))
                        _this.remove(v);
                    else
                        _this.add(v);
                });
            }
            else {
                Utility_1.using(new Set(other), function (o) { return _this.symmetricExceptWith(o); });
            }
        };
        Set.prototype.unionWith = function (other) {
            var _this = this;
            Enumerator_1.forEach(other, function (v) {
                _this.add(v);
            });
        };
        Set.prototype.add = function (item) {
            if (!this.contains(item)) {
                var type = typeof item;
                if (!Types_1.default.isPrimitive(type))
                    throw new ArgumentException_1.default("item", "A Set can only index primitives.  Complex objects require a HashSet.");
                var r = this._registry;
                var t = r && r[type];
                if (!r)
                    this._registry = r = {};
                if (!t)
                    r[type] = t = {};
                var node = { value: item };
                this._getSet().addNode(node);
                t[item] = node;
                ++this._count;
            }
        };
        Set.prototype.clear = function () {
            var _ = this;
            _._count = 0;
            wipe(_._registry, 2);
            var s = _._set;
            return s ? s.clear() : 0;
        };
        Set.prototype.dispose = function () {
            this.clear();
            this._set = null;
            this._registry = null;
        };
        Set.prototype._getNode = function (item) {
            var r = this._registry, t = r && r[typeof item];
            return t && t[item];
        };
        Set.prototype.contains = function (item) {
            return !(!this._count || !this._getNode(item));
        };
        Set.prototype.copyTo = function (array, index) {
            if (index === void 0) { index = 0; }
            if (!array)
                throw new ArgumentNullException_1.default('array');
            var s = this._set, c = this._count;
            if (!s || !c)
                return array;
            var minLength = index + c;
            if (array.length < minLength)
                array.length = minLength;
            return LinkedNodeList_1.default.copyValues(s, array, index);
        };
        Set.prototype.toArray = function () {
            var s = this._set;
            return s ? s.map(function (n) { return n.value; }) : [];
        };
        Set.prototype.remove = function (item) {
            var r = this._registry, t = r && r[typeof item], node = t && t[item];
            if (node) {
                delete t[item];
                var s = this._set;
                if (s && s.removeNode(node)) {
                    --this._count;
                    return 1;
                }
            }
            return 0;
        };
        Set.prototype.getEnumerator = function () {
            var s = this._set;
            return s && this._count
                ? LinkedNodeList_1.default.valueEnumeratorFrom(s)
                : Enumerator_1.empty;
        };
        return Set;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Set;
    function wipe(map, depth) {
        if (depth === void 0) { depth = 1; }
        if (map && depth) {
            for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
                var key = _a[_i];
                var v = map[key];
                delete map[key];
                wipe(v, depth - 1);
            }
        }
    }
});
//# sourceMappingURL=Set.js.map