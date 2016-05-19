/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
System.register(["./ObservableBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ObservableBase_1;
    var ObservableNodeBase;
    return {
        setters:[
            function (ObservableBase_1_1) {
                ObservableBase_1 = ObservableBase_1_1;
            }],
        execute: function() {
            ObservableNodeBase = (function (_super) {
                __extends(ObservableNodeBase, _super);
                function ObservableNodeBase() {
                    _super.apply(this, arguments);
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
            exports_1("default",ObservableNodeBase);
        }
    }
});
//# sourceMappingURL=ObservableNodeBase.js.map