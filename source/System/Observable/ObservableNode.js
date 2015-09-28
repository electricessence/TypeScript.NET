/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SubscribableBase'], function (require, exports, SubscribableBase) {
    var ObservableNode = (function (_super) {
        __extends(ObservableNode, _super);
        function ObservableNode() {
            _super.apply(this, arguments);
        }
        ObservableNode.prototype.onNext = function (value) {
            processAction(this._getSubscribers(), function (s) { s.onNext && s.onNext(value); });
        };
        ObservableNode.prototype.onError = function (error) {
            processAction(this._getSubscribers(), function (s) { s.onError && s.onError(error); });
        };
        ObservableNode.prototype.onCompleted = function () {
            processAction(this._unsubscribeAll(true), function (s) { s.onCompleted && s.onCompleted(); });
        };
        return ObservableNode;
    })(SubscribableBase);
    var OBSERVER_ERROR_MESSAGE = 'One or more observers had errors when attempting to pass information.';
    function processAction(observers, handler, dispose) {
        if (dispose === void 0) { dispose = true; }
        var observersErrors = null;
        for (var _i = 0; _i < observers.length; _i++) {
            var s = observers[_i];
            try {
                handler(s);
            }
            catch (ex) {
                observersErrors = observersErrors || [];
                observersErrors.push({ observer: s, ex: ex });
            }
        }
        if (dispose)
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
    return ObservableNode;
});
//# sourceMappingURL=ObservableNode.js.map