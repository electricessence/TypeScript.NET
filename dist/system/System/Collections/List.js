/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Compare", "./Array/Utility", "./Enumeration/Enumerator", "../Types", "./Enumeration/ArrayEnumerator", "./CollectionBase", "../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Compare_1, Utility_1, Enumerator_1, Types_1, ArrayEnumerator_1, CollectionBase_1, extends_1;
    var __extends, List;
    return {
        setters:[
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            },
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            },
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (ArrayEnumerator_1_1) {
                ArrayEnumerator_1 = ArrayEnumerator_1_1;
            },
            function (CollectionBase_1_1) {
                CollectionBase_1 = CollectionBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            List = (function (_super) {
                __extends(List, _super);
                function List(source, equalityComparer) {
                    if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
                    _super.call(this, null, equalityComparer);
                    var _ = this;
                    if (Array.isArray(source)) {
                        _._source = source.slice();
                    }
                    else {
                        _._source = [];
                        _._importEntries(source);
                    }
                }
                List.prototype.getCount = function () {
                    return this._source.length;
                };
                List.prototype._addInternal = function (entry) {
                    this._source.push(entry);
                    return true;
                };
                List.prototype._removeInternal = function (entry, max) {
                    if (max === void 0) { max = Infinity; }
                    return Utility_1.remove(this._source, entry, max, this._equalityComparer);
                };
                List.prototype._clearInternal = function () {
                    var len = this._source.length;
                    this._source.length = 0;
                    return len;
                };
                List.prototype._importEntries = function (entries) {
                    if (Types_1.Type.isArrayLike(entries)) {
                        var len = entries.length;
                        if (!len)
                            return 0;
                        var s = this._source;
                        var first = s.length;
                        s.length += len;
                        for (var i = 0; i < len; i++) {
                            s[i + first] = entries[i];
                        }
                        return len;
                    }
                    else {
                        return _super.prototype._importEntries.call(this, entries);
                    }
                };
                List.prototype.get = function (index) {
                    return this._source[index];
                };
                List.prototype.set = function (index, value) {
                    var s = this._source;
                    if (index < s.length && Compare_1.areEqual(value, s[index]))
                        return false;
                    s[index] = value;
                    this._onModified();
                    return true;
                };
                List.prototype.indexOf = function (item) {
                    return Utility_1.indexOf(this._source, item, this._equalityComparer);
                };
                List.prototype.insert = function (index, value) {
                    var s = this._source;
                    if (index < s.length) {
                        this._source.splice(index, 0, value);
                    }
                    else {
                        this._source[index] = value;
                    }
                    this._onModified();
                };
                List.prototype.removeAt = function (index) {
                    if (Utility_1.removeIndex(this._source, index)) {
                        this._onModified();
                        return true;
                    }
                    return false;
                };
                List.prototype.contains = function (item) {
                    return Utility_1.contains(this._source, item, this._equalityComparer);
                };
                List.prototype.copyTo = function (target, index) {
                    return Utility_1.copyTo(this._source, target, 0, index);
                };
                List.prototype.getEnumerator = function () {
                    return new ArrayEnumerator_1.ArrayEnumerator(this._source);
                };
                List.prototype.forEach = function (action, useCopy) {
                    var s = this._source;
                    return Enumerator_1.forEach(useCopy ? s.slice() : s, action);
                };
                return List;
            }(CollectionBase_1.CollectionBase));
            exports_1("List", List);
            exports_1("default",List);
        }
    }
});
//# sourceMappingURL=List.js.map