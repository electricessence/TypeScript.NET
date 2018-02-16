/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
System.register(["./ObservableBase", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ObservableBase_1, extends_1, __extends, ObservableNodeBase;
    return {
        setters: [
            function (ObservableBase_1_1) {
                ObservableBase_1 = ObservableBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Based upon .NET source.
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            ObservableNodeBase = /** @class */ (function (_super) {
                __extends(ObservableNodeBase, _super);
                function ObservableNodeBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ObservableNodeBase.prototype.onNext = function (value) {
                    this._onNext(value);
                };
                ObservableNodeBase.prototype.onError = function (error) {
                    this._onError(error);
                };
                ObservableNodeBase.prototype.onCompleted = function () {
                    this._onCompleted();
                };
                return ObservableNodeBase;
            }(ObservableBase_1.default));
            exports_1("ObservableNodeBase", ObservableNodeBase);
            exports_1("default", ObservableNodeBase);
        }
    };
});
//# sourceMappingURL=ObservableNodeBase.js.map