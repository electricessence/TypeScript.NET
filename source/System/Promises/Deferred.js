///<reference path="PromiseState.d.ts"/>
///<reference path="IDeferred.d.ts"/>
///<reference path="IPromise.d.ts"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var DeferredBase = (function () {
        function DeferredBase() {
        }
        DeferredBase.prototype.resolve = function (value) {
        };
        DeferredBase.prototype.reject = function (reason) {
        };
        return DeferredBase;
    })();
    var Promise = (function () {
        function Promise() {
            this._promisees = [];
        }
        Promise.prototype.then = function (onFulfill, onReject) {
            this._promisees.push({ onFulfill: onFulfill, onReject: onReject });
            return undefined;
        };
        return Promise;
    })();
});
//# sourceMappingURL=Deferred.js.map