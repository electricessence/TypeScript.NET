/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import * as tslib_1 from "tslib";
import { Fulfilled, handleSyncIfPossible } from "./Promise";
import DisposableBase from "../Disposable/DisposableBase";
import ArrayPromise from "./ArrayPromise";
import all from "./Functions/all";
import race from "./Functions/race";
import waitAll from "./Functions/waitAll";
import wrap from "./Functions/wrap";
import isPromise from "./Functions/isPromise";
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
        return all(this._source);
    };
    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @returns {PromiseBase<any>} A new Promise.
     */
    PromiseCollection.prototype.race = function () {
        this.throwIfDisposed();
        return race(this._source);
    };
    /**
     * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
     * Unlike .all this method waits for all rejections as well as fulfillment.
     * @returns {PromiseBase<PromiseLike<any>[]>}
     */
    PromiseCollection.prototype.waitAll = function () {
        this.throwIfDisposed();
        return waitAll(this._source);
    };
    /**
     * Waits for all the values to resolve and then applies a transform.
     * @param transform
     * @returns {PromiseBase<Array<any>>}
     */
    PromiseCollection.prototype.map = function (transform) {
        var _this = this;
        this.throwIfDisposed();
        return new ArrayPromise(function (resolve) {
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
        return new PromiseCollection(this._source.map(function (p) { return handleSyncIfPossible(p, transform); }));
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
        return wrap(this._source
            .reduce(function (previous, current, i, array) {
            return handleSyncIfPossible(previous, function (p) { return handleSyncIfPossible(current, function (c) { return reduction(p, c, i, array); }); });
        }, isPromise(initialValue)
            ? initialValue
            : new Fulfilled(initialValue)));
    };
    return PromiseCollection;
}(DisposableBase));
export default PromiseCollection;
//# sourceMappingURL=PromiseCollection.js.map