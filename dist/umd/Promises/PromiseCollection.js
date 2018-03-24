/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Promise", "../Disposable/DisposableBase", "./ArrayPromise", "./Functions/all", "./Functions/race", "./Functions/waitAll", "./Functions/wrap", "./Functions/isPromise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Promise_1 = require("./Promise");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var ArrayPromise_1 = require("./ArrayPromise");
    var all_1 = require("./Functions/all");
    var race_1 = require("./Functions/race");
    var waitAll_1 = require("./Functions/waitAll");
    var wrap_1 = require("./Functions/wrap");
    var isPromise_1 = require("./Functions/isPromise");
    /**
     * A Promise collection exposes useful methods for handling a collection of promises and their results.
     */
    var PromiseCollection = /** @class */ (function (_super) {
        tslib_1.__extends(PromiseCollection, _super);
        function PromiseCollection(source) {
            var _this = _super.call(this, "PromiseCollection") || this;
            _this._source = source && source.slice() || [];
            return _this;
        }
        PromiseCollection.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._source.length = 0;
            this._source = null;
        };
        Object.defineProperty(PromiseCollection.prototype, "promises", {
            /**
             * Returns a copy of the source promises.
             * @returns {PromiseLike<PromiseLike<any>>[]}
             */
            get: function () {
                this.throwIfDisposed();
                return this._source.slice();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
         * @returns {PromiseBase<any>}
         */
        PromiseCollection.prototype.all = function () {
            this.throwIfDisposed();
            return all_1.default(this._source);
        };
        /**
         * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
         * or rejected.
         * @returns {PromiseBase<any>} A new Promise.
         */
        PromiseCollection.prototype.race = function () {
            this.throwIfDisposed();
            return race_1.default(this._source);
        };
        /**
         * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
         * Unlike .all this method waits for all rejections as well as fulfillment.
         * @returns {PromiseBase<PromiseLike<any>[]>}
         */
        PromiseCollection.prototype.waitAll = function () {
            this.throwIfDisposed();
            return waitAll_1.default(this._source);
        };
        /**
         * Waits for all the values to resolve and then applies a transform.
         * @param transform
         * @returns {PromiseBase<Array<any>>}
         */
        PromiseCollection.prototype.map = function (transform) {
            var _this = this;
            this.throwIfDisposed();
            return new ArrayPromise_1.default(function (resolve) {
                _this.all()
                    .doneNow(function (result) { return resolve(result.map(transform)); });
            }, true);
        };
        /**
         * Applies a transform to each promise and defers the result.
         * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
         * @param transform
         * @returns {PromiseCollection<U>}
         */
        PromiseCollection.prototype.pipe = function (transform) {
            this.throwIfDisposed();
            return new PromiseCollection(this._source.map(function (p) { return Promise_1.handleSyncIfPossible(p, transform); }));
        };
        /**
         * Behaves like array reduce.
         * Creates the promise chain necessary to produce the desired result.
         * @param reduction
         * @param initialValue
         * @returns {PromiseBase<PromiseLike<any>>}
         */
        PromiseCollection.prototype.reduce = function (reduction, initialValue) {
            this.throwIfDisposed();
            return wrap_1.default(this._source
                .reduce(function (previous, current, i, array) {
                return Promise_1.handleSyncIfPossible(previous, function (p) { return Promise_1.handleSyncIfPossible(current, function (c) { return reduction(p, c, i, array); }); });
            }, isPromise_1.default(initialValue)
                ? initialValue
                : new Promise_1.Fulfilled(initialValue)));
        };
        return PromiseCollection;
    }(DisposableBase_1.default));
    exports.default = PromiseCollection;
});
//# sourceMappingURL=PromiseCollection.js.map