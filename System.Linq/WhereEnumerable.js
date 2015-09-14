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
define(["require", "exports", '../System/Disposable/Utility', '../System/Collections/Enumeration/EnumeratorBase', './Enumerable', './WhereSelectEnumerable'], function (require, exports, DisposeUtility, EnumeratorBase, Enumerable, WhereSelectEnumerable) {
    'use strict';
    var WhereEnumerable = (function (_super) {
        __extends(WhereEnumerable, _super);
        function WhereEnumerable(prevSource, prevPredicate // predicate.length always <= 1
            ) {
            _super.call(this, null);
            this.prevSource = prevSource;
            this.prevPredicate = prevPredicate;
        }
        WhereEnumerable.prototype.where = function (predicate) {
            if (predicate.length > 1)
                return _super.prototype.where.call(this, predicate);
            var prevPredicate = this.prevPredicate;
            var composedPredicate = function (x) { return prevPredicate(x) && predicate(x); };
            return new WhereEnumerable(this.prevSource, composedPredicate);
        };
        WhereEnumerable.prototype.select = function (selector) {
            if (selector.length > 1)
                return _super.prototype.select.call(this, selector);
            return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector);
        };
        WhereEnumerable.prototype.getEnumerator = function () {
            var predicate = this.prevPredicate;
            var source = this.prevSource;
            var enumerator;
            return new EnumeratorBase(function () { enumerator = source.getEnumerator(); }, function (yielder) {
                while (enumerator.moveNext()) {
                    if (predicate(enumerator.current))
                        return yielder.yieldReturn(enumerator.current);
                }
                return false;
            }, function () { DisposeUtility.dispose(enumerator); });
        };
        WhereEnumerable.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this.prevPredicate = null;
            this.prevSource = null;
        };
        return WhereEnumerable;
    })(Enumerable);
    return WhereEnumerable;
});
//# sourceMappingURL=WhereEnumerable.js.map