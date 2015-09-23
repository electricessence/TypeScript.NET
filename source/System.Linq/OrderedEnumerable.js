/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../System/System', '../System/Collections/Enumeration/EnumeratorBase', './Enumerable'], function (require, exports, System, EnumeratorBase, Enumerable) {
    'use strict';
    var INT_0 = 0 | 0, INT_NEGATIVE_1 = -1 | 0, INT_POSITIVE_1 = +1 | 0;
    var OrderedEnumerable = (function (_super) {
        __extends(OrderedEnumerable, _super);
        function OrderedEnumerable(source, keySelector, descending, parent) {
            _super.call(this, null);
            this.source = source;
            this.keySelector = keySelector;
            this.descending = descending;
            this.parent = parent;
        }
        OrderedEnumerable.prototype.createOrderedEnumerable = function (keySelector, descending) {
            return new OrderedEnumerable(this.source, keySelector, descending, this);
        };
        OrderedEnumerable.prototype.thenBy = function (keySelector) {
            return this.createOrderedEnumerable(keySelector, false);
        };
        OrderedEnumerable.prototype.thenByDescending = function (keySelector) {
            return this.createOrderedEnumerable(keySelector, true);
        };
        OrderedEnumerable.prototype.getEnumerator = function () {
            var _ = this;
            var buffer;
            var indexes;
            var index = INT_0;
            return new EnumeratorBase(function () {
                index = INT_0;
                buffer = [];
                indexes = [];
                Enumerable.forEach(_.source, function (item, i) {
                    buffer[i] = item;
                    indexes[i] = i;
                });
                var sortContext = SortContext.create(_);
                sortContext.generateKeys(buffer);
                indexes.sort(function (a, b) { return sortContext.compare(a, b); });
            }, function (yielder) {
                return (index < indexes.length)
                    ? yielder.yieldReturn(buffer[indexes[index++]])
                    : false;
            }, function () {
                if (buffer)
                    buffer.length = 0;
                buffer = null;
                if (indexes)
                    indexes.length = 0;
                indexes = null;
            });
        };
        OrderedEnumerable.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this.source = null;
            this.keySelector = null;
            this.descending = null;
            this.parent = null;
        };
        return OrderedEnumerable;
    })(Enumerable);
    var SortContext = (function () {
        function SortContext(keySelector, descending, child) {
            this.keySelector = keySelector;
            this.descending = descending;
            this.child = child;
            this.keys = null;
        }
        SortContext.create = function (orderedEnumerable, currentContext) {
            if (currentContext === void 0) { currentContext = null; }
            var context = new SortContext(orderedEnumerable.keySelector, orderedEnumerable.descending, currentContext);
            if (orderedEnumerable.parent)
                return SortContext.create(orderedEnumerable.parent, context);
            return context;
        };
        SortContext.prototype.generateKeys = function (source) {
            var _ = this;
            var len = source.length | 0;
            var keySelector = _.keySelector;
            var keys = new Array(len);
            for (var i = INT_0; i < len; ++i) {
                keys[i] = keySelector(source[i]);
            }
            _.keys = keys;
            if (_.child)
                _.child.generateKeys(source);
        };
        SortContext.prototype.compare = function (index1, index2) {
            var _ = this, keys = _.keys;
            var comparison = System.compare(keys[index1], keys[index2]);
            if (comparison == 0) {
                var child = _.child;
                return child
                    ? child.compare(index1, index2)
                    : System.compare(index1, index2);
            }
            return _.descending ? -comparison : comparison;
        };
        return SortContext;
    })();
    return OrderedEnumerable;
});
//# sourceMappingURL=OrderedEnumerable.js.map