var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    (function (System) {
        (function (Linq) {
            var EnumeratorBase = System.Collections.EnumeratorBase;

            var Functions = System.Functions;
            var Types = System.Types;

            var Enumerable = (function (_super) {
                __extends(Enumerable, _super);
                function Enumerable(enumeratorFactory) {
                    _super.call(this);
                    this.enumeratorFactory = enumeratorFactory;
                }
                Enumerable.prototype.getEnumerator = function () {
                    return this.enumeratorFactory();
                };

                Enumerable.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this.enumeratorFactory = null;
                };

                Enumerable.choice = function (values) {
                    return new Enumerable(function () {
                        return new EnumeratorBase(null, function (yielder) {
                            return yielder.yieldReturn(values[Math.floor(Math.random() * values.length)]);
                        });
                    });
                };

                Enumerable.cycle = function (values) {
                    return new Enumerable(function () {
                        var index = 0;
                        return new EnumeratorBase(null, function (yielder) {
                            if (index >= values.length)
                                index = 0;
                            return yielder.yieldReturn(values[index++]);
                        });
                    });
                };

                Enumerable.empty = function () {
                    return new Enumerable(function () {
                        return new EnumeratorBase(null, Functions.False);
                    });
                };
                return Enumerable;
            })(DisposableBase);
            Linq.Enumerable = Enumerable;
        })(System.Linq || (System.Linq = {}));
        var Linq = System.Linq;
    })(exports.System || (exports.System = {}));
    var System = exports.System;
});
//# sourceMappingURL=Enumerable.js.map
