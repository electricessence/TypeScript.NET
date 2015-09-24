/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../System/Disposable/Utility', '../System/Collections/Enumeration/EnumeratorBase', './Grouping'], function (require, exports, DisposeUtility, EnumeratorBase, Grouping) {
    'use strict';
    var Lookup = (function () {
        function Lookup(_dictionary) {
            this._dictionary = _dictionary;
        }
        Object.defineProperty(Lookup.prototype, "count", {
            get: function () {
                return this._dictionary.count;
            },
            enumerable: true,
            configurable: true
        });
        Lookup.prototype.get = function (key) {
            return this._dictionary.getValue(key);
        };
        Lookup.prototype.contains = function (key) {
            return this._dictionary.containsKey(key);
        };
        Lookup.prototype.getEnumerator = function () {
            var _ = this;
            var enumerator;
            return new EnumeratorBase(function () { enumerator = _._dictionary.getEnumerator(); }, function (yielder) {
                if (!enumerator.moveNext())
                    return false;
                var current = enumerator.current;
                return yielder.yieldReturn(new Grouping(current.key, current.value));
            }, function () { DisposeUtility.dispose(enumerator); });
        };
        return Lookup;
    })();
    return Lookup;
});
//# sourceMappingURL=Lookup.js.map