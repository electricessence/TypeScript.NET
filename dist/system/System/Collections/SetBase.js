/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./LinkedNodeList", "../Exceptions/ArgumentNullException", "./Enumeration/Enumerator", "./Enumeration/EmptyEnumerator", "../Disposable/dispose", "../Compare", "./CollectionBase", "../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var LinkedNodeList_1, ArgumentNullException_1, Enumerator_1, EmptyEnumerator_1, dispose_1, Compare_1, CollectionBase_1, extends_1;
    var __extends, OTHER, SetBase;
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
    return {
        setters:[
            function (LinkedNodeList_1_1) {
                LinkedNodeList_1 = LinkedNodeList_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            },
            function (EmptyEnumerator_1_1) {
                EmptyEnumerator_1 = EmptyEnumerator_1_1;
            },
            function (dispose_1_1) {
                dispose_1 = dispose_1_1;
            },
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (CollectionBase_1_1) {
                CollectionBase_1 = CollectionBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            OTHER = 'other';
            SetBase = (function (_super) {
                __extends(SetBase, _super);
                function SetBase(source) {
                    _super.call(this, null, Compare_1.areEqual);
                    this._importEntries(source);
                }
                SetBase.prototype._getSet = function () {
                    var s = this._set;
                    if (!s)
                        this._set = s = new LinkedNodeList_1.LinkedNodeList();
                    return s;
                };
                SetBase.prototype.getCount = function () {
                    return this._set ? this._set.unsafeCount : 0;
                };
                SetBase.prototype.exceptWith = function (other) {
                    var _ = this;
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    Enumerator_1.forEach(other, function (v) {
                        if (_._removeInternal(v))
                            _._incrementModified();
                    });
                    _._signalModification();
                };
                SetBase.prototype.intersectWith = function (other) {
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    var _ = this;
                    if (other instanceof SetBase) {
                        var s = _._set;
                        if (s)
                            s.forEach(function (n) {
                                if (!other.contains(n.value) && _._removeInternal(n.value))
                                    _._incrementModified();
                            });
                        _._signalModification();
                    }
                    else {
                        dispose_1.using(_.newUsing(other), function (o) { return _.intersectWith(o); });
                    }
                };
                SetBase.prototype.isProperSubsetOf = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    return other instanceof SetBase
                        ? other.isProperSupersetOf(this)
                        : dispose_1.using(this.newUsing(other), function (o) { return o.isProperSupersetOf(_this); });
                };
                SetBase.prototype.isProperSupersetOf = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    var result = true, count;
                    if (other instanceof SetBase) {
                        result = this.isSupersetOf(other);
                        count = other.getCount();
                    }
                    else {
                        count = dispose_1.using(this.newUsing(), function (o) {
                            Enumerator_1.forEach(other, function (v) {
                                o.add(v);
                                return result = _this.contains(v);
                            });
                            return o.getCount();
                        });
                    }
                    return result && this.getCount() > count;
                };
                SetBase.prototype.isSubsetOf = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    return other instanceof SetBase
                        ? other.isSupersetOf(this)
                        : dispose_1.using(this.newUsing(other), function (o) { return o.isSupersetOf(_this); });
                };
                SetBase.prototype.isSupersetOf = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    var result = true;
                    Enumerator_1.forEach(other, function (v) {
                        return result = _this.contains(v);
                    });
                    return result;
                };
                SetBase.prototype.overlaps = function (other) {
                    var _this = this;
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    var result = false;
                    Enumerator_1.forEach(other, function (v) { return !(result = _this.contains(v)); });
                    return result;
                };
                SetBase.prototype.setEquals = function (other) {
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    return this.getCount() == (other instanceof SetBase
                        ? other.getCount()
                        : dispose_1.using(this.newUsing(other), function (o) { return o.getCount(); }))
                        && this.isSubsetOf(other);
                };
                SetBase.prototype.symmetricExceptWith = function (other) {
                    if (!other)
                        throw new ArgumentNullException_1.ArgumentNullException(OTHER);
                    var _ = this;
                    if (other instanceof SetBase) {
                        Enumerator_1.forEach(other, function (v) {
                            if (_.contains(v)) {
                                if (_._removeInternal(v))
                                    _._incrementModified();
                            }
                            else {
                                if (_._addInternal(v))
                                    _._incrementModified();
                            }
                        });
                        _._signalModification();
                    }
                    else {
                        dispose_1.using(this.newUsing(other), function (o) { return _.symmetricExceptWith(o); });
                    }
                };
                SetBase.prototype.unionWith = function (other) {
                    this.importEntries(other);
                };
                SetBase.prototype._clearInternal = function () {
                    var s = this._set;
                    return s ? s.clear() : 0;
                };
                SetBase.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this._set = null;
                };
                SetBase.prototype.contains = function (item) {
                    return !(!this.getCount() || !this._getNode(item));
                };
                SetBase.prototype.getEnumerator = function () {
                    var s = this._set;
                    return s && this.getCount()
                        ? LinkedNodeList_1.LinkedNodeList.valueEnumeratorFrom(s)
                        : EmptyEnumerator_1.EmptyEnumerator;
                };
                SetBase.prototype.forEach = function (action, useCopy) {
                    if (useCopy === void 0) { useCopy = false; }
                    return useCopy
                        ? _super.prototype.forEach.call(this, action, useCopy)
                        : this._set.forEach(function (node, i) { return action(node.value, i); });
                };
                SetBase.prototype._removeNode = function (node) {
                    if (!node)
                        return false;
                    return this.remove(node.value) != 0;
                };
                SetBase.prototype.removeFirst = function () {
                    var s = this._set;
                    return this._removeNode(s && s.first);
                };
                SetBase.prototype.removeLast = function () {
                    var s = this._set;
                    return this._removeNode(s && s.last);
                };
                return SetBase;
            }(CollectionBase_1.CollectionBase));
            exports_1("SetBase", SetBase);
            exports_1("default",SetBase);
        }
    }
});
//# sourceMappingURL=SetBase.js.map