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
define(["require", "exports", '../System/Disposable/Utility', '../System/Collections/Enumeration/EnumeratorBase', './Enumerable', './WhereEnumerable'], function (require, exports, DisposeUtility, EnumeratorBase, Enumerable, WhereEnumerable) {
    'use strict';
    var WhereSelectEnumerable = (function (_super) {
        __extends(WhereSelectEnumerable, _super);
        function WhereSelectEnumerable(prevSource, prevPredicate, prevSelector) {
            _super.call(this, null);
            this.prevSource = prevSource;
            this.prevPredicate = prevPredicate;
            this.prevSelector = prevSelector;
        }
        WhereSelectEnumerable.prototype.where = function (predicate) {
            if (predicate.length > 1)
                return _super.prototype.where.call(this, predicate);
            return new WhereEnumerable(this, predicate);
        };
        WhereSelectEnumerable.prototype.select = function (selector) {
            if (selector.length > 1)
                return _super.prototype.select.call(this, selector);
            var _ = this;
            var prevSelector = _.prevSelector;
            var composedSelector = function (x) { return selector(prevSelector(x)); };
            return new WhereSelectEnumerable(_.prevSource, _.prevPredicate, composedSelector);
        };
        WhereSelectEnumerable.prototype.getEnumerator = function () {
            var _ = this, predicate = _.prevPredicate, source = _.prevSource, selector = _.prevSelector, enumerator;
            return new EnumeratorBase(function () { enumerator = source.getEnumerator(); }, function (yielder) {
                while (enumerator.moveNext()) {
                    var c = enumerator.current;
                    if (predicate == null || predicate(c)) {
                        return yielder.yieldReturn(selector(c));
                    }
                }
                return false;
            }, function () { DisposeUtility.dispose(enumerator); });
        };
        WhereSelectEnumerable.prototype._onDispose = function () {
            var _ = this;
            _super.prototype._onDispose.call(this);
            _.prevPredicate = null;
            _.prevSource = null;
            _.prevSelector = null;
        };
        return WhereSelectEnumerable;
    })(Enumerable);
    return WhereSelectEnumerable;
});
//# sourceMappingURL=WhereSelectEnumerable.js.map