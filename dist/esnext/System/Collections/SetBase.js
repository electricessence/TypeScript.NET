/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import LinkedNodeList from "./LinkedNodeList";
import CollectionBase from "./CollectionBase";
import areEqual from "../Comparison/areEqual";
import { forEach } from "./Enumeration/Enumerator";
import { using } from "../Disposable/dispose";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import EmptyEnumerator from "./Enumeration/EmptyEnumerator";
var VOID0 = void 0;
var OTHER = 'other';
var SetBase = /** @class */ (function (_super) {
    tslib_1.__extends(SetBase, _super);
    function SetBase(source) {
        var _this = _super.call(this, VOID0, areEqual) || this;
        _this._importEntries(source);
        return _this;
    }
    SetBase.prototype._getSet = function () {
        var s = this._set;
        if (!s)
            this._set = s = new LinkedNodeList();
        return s;
    };
    SetBase.prototype.getCount = function () {
        return this._set ? this._set.unsafeCount : 0;
    };
    SetBase.prototype.exceptWith = function (other) {
        var _ = this;
        if (!other)
            throw new ArgumentNullException(OTHER);
        forEach(other, function (v) {
            if (_._removeInternal(v))
                _._incrementModified();
        });
        _._signalModification();
    };
    SetBase.prototype.intersectWith = function (other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        var _ = this;
        if (other instanceof SetBase) {
            var s = _._set;
            if (s)
                s.forEach(function (n) {
                    if (!other.contains(n.value) && _._removeInternal(n.value))
                        _._incrementModified();
                }, true);
            _._signalModification();
        }
        else {
            using(_.newUsing(other), function (o) { return _.intersectWith(o); });
        }
    };
    SetBase.prototype.isProperSubsetOf = function (other) {
        var _this = this;
        if (!other)
            throw new ArgumentNullException(OTHER);
        return other instanceof SetBase
            ? other.isProperSupersetOf(this)
            : using(this.newUsing(other), function (o) { return o.isProperSupersetOf(_this); });
    };
    SetBase.prototype.isProperSupersetOf = function (other) {
        var _this = this;
        if (!other)
            throw new ArgumentNullException(OTHER);
        var result = true, count;
        if (other instanceof SetBase) {
            result = this.isSupersetOf(other);
            count = other.getCount();
        }
        else {
            count = using(this.newUsing(), function (o) {
                forEach(other, function (v) {
                    o.add(v); // We have to add to another set in order to filter out duplicates.
                    // contains == false will cause this to exit.
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
            throw new ArgumentNullException(OTHER);
        return other instanceof SetBase
            ? other.isSupersetOf(this)
            : using(this.newUsing(other), function (o) { return o.isSupersetOf(_this); });
    };
    SetBase.prototype.isSupersetOf = function (other) {
        var _this = this;
        if (!other)
            throw new ArgumentNullException(OTHER);
        var result = true;
        forEach(other, function (v) {
            return result = _this.contains(v);
        });
        return result;
    };
    SetBase.prototype.overlaps = function (other) {
        var _this = this;
        if (!other)
            throw new ArgumentNullException(OTHER);
        var result = false;
        forEach(other, function (v) { return !(result = _this.contains(v)); });
        return result;
    };
    SetBase.prototype.setEquals = function (other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        return this.getCount() == (other instanceof SetBase
            ? other.getCount()
            : using(this.newUsing(other), function (o) { return o.getCount(); }))
            && this.isSubsetOf(other);
    };
    SetBase.prototype.symmetricExceptWith = function (other) {
        if (!other)
            throw new ArgumentNullException(OTHER);
        var _ = this;
        if (other instanceof SetBase) {
            forEach(other, function (v) {
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
            using(this.newUsing(other), function (o) { return _.symmetricExceptWith(o); });
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
        var _ = this;
        _.throwIfDisposed();
        var s = _._set;
        return s && _.getCount()
            ? LinkedNodeList.valueEnumeratorFrom(s)
            : EmptyEnumerator;
    };
    SetBase.prototype.forEach = function (action, useCopy) {
        var s = this._set;
        if (!s)
            return 0;
        return useCopy
            ? _super.prototype.forEach.call(this, action, useCopy)
            : s.forEach(function (node, i) { return action(node.value, i); });
    };
    SetBase.prototype._removeNode = function (node) {
        return !!node
            && this.remove(node.value) != 0;
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
}(CollectionBase));
export default SetBase;
//# sourceMappingURL=SetBase.js.map