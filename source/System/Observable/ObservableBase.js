/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./SubscribableBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var SubscribableBase_1 = require("./SubscribableBase");
    var ObservableBase = (function (_super) {
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
    exports.ObservableBase = ObservableBase;
    var OBSERVER_ERROR_MESSAGE = 'One or more observers had errors when attempting to pass information.';
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ObservableBase;
});
//# sourceMappingURL=ObservableBase.js.map