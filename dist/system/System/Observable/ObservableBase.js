/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
System.register(["./SubscribableBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SubscribableBase_1;
    var ObservableBase, OBSERVER_ERROR_MESSAGE;
    function processAction(observers, handler) {
        var observersErrors = null;
        for (var _i = 0, observers_1 = observers; _i < observers_1.length; _i++) {
            var s = observers_1[_i];
            try {
                handler(s);
            }
            catch (ex) {
                observersErrors = observersErrors || [];
                observersErrors.push({ observer: s, ex: ex });
            }
        }
        observers.length = 0;
        if (observersErrors && observersErrors.length) {
            if (console && console.error)
                console.error(OBSERVER_ERROR_MESSAGE, observersErrors);
            else
                throw {
                    message: OBSERVER_ERROR_MESSAGE,
                    errors: observersErrors
                };
        }
    }
    return {
        setters:[
            function (SubscribableBase_1_1) {
                SubscribableBase_1 = SubscribableBase_1_1;
            }],
        execute: function() {
            ObservableBase = (function (_super) {
                __extends(ObservableBase, _super);
                function ObservableBase() {
                    _super.apply(this, arguments);
                }
                ObservableBase.prototype._onNext = function (value) {
                    processAction(this._getSubscribers(), function (s) { s.onNext && s.onNext(value); });
                };
                ObservableBase.prototype._onError = function (error) {
                    processAction(this._getSubscribers(), function (s) { s.onError && s.onError(error); });
                };
                ObservableBase.prototype._onCompleted = function () {
                    processAction(this._unsubscribeAll(true), function (s) { s.onCompleted && s.onCompleted(); });
                };
                return ObservableBase;
            }(SubscribableBase_1.SubscribableBase));
            exports_1("ObservableBase", ObservableBase);
            OBSERVER_ERROR_MESSAGE = 'One or more observers had errors when attempting to pass information.';
            exports_1("default",ObservableBase);
        }
    }
});
//# sourceMappingURL=ObservableBase.js.map