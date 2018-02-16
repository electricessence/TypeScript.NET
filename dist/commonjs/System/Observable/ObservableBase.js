"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * C# Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SubscribableBase_1 = require("./SubscribableBase");
var extends_1 = require("../../extends");
//noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
// Can be used as a base class, mixin, or simply reference on how to implement the pattern.
var ObservableBase = /** @class */ (function (_super) {
    __extends(ObservableBase, _super);
    function ObservableBase() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    ObservableBase.prototype.subscribe = function (subscriber, onError, onCompleted) {
        var s;
        var isFn = typeof subscriber == 'function';
        if (onError || onCompleted || isFn) {
            if (subscriber && !isFn)
                throw "Invalid subscriber type.";
            s = {
                onNext: subscriber,
                onError: onError,
                onCompleted: onCompleted
            };
        }
        else {
            s = subscriber;
        }
        return _super.prototype.subscribe.call(this, s);
    };
    return ObservableBase;
}(SubscribableBase_1.SubscribableBase));
exports.ObservableBase = ObservableBase;
var OBSERVER_ERROR_MESSAGE = 'One or more observers had errors when attempting to pass information.';
function processAction(observers, handler) {
    if (!observers)
        return;
    var observersErrors = null;
    for (var _i = 0, observers_1 = observers; _i < observers_1.length; _i++) {
        var s = observers_1[_i];
        try {
            handler(s);
        }
        catch (ex) {
            observersErrors = observersErrors || [];
            // Don't let one error prevent others from recieving information.
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
exports.default = ObservableBase;
//# sourceMappingURL=ObservableBase.js.map