/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../Exceptions/ArgumentNullException", "../../Disposable/DisposableBase", "../../Uri/Uri"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var DisposableBase_1 = require("../../Disposable/DisposableBase");
    var Uri_1 = require("../../Uri/Uri");
    var NAME = 'HttpRequestFactory';
    /**
     * This class exposes a factory for making requests to prepared uri and params.
     */
    var HttpRequestFactory = /** @class */ (function (_super) {
        tslib_1.__extends(HttpRequestFactory, _super);
        function HttpRequestFactory(_http, uriDefaults) {
            var _this = _super.call(this, NAME) || this;
            _this._http = _http;
            if (!_http)
                throw new ArgumentNullException_1.default('_http');
            _this._uriDefaults = Uri_1.default.from(uriDefaults);
            return _this;
        }
        HttpRequestFactory.prototype._onDispose = function () {
            // super._onDispose(); // Not required for first level inheritance.
            this._http = null;
            this._uriDefaults = null;
        };
        HttpRequestFactory.prototype.uri = function (uri) {
            var _ = this;
            _.throwIfDisposed();
            var d = _._uriDefaults, u = Uri_1.default.from(uri, d);
            return d && u.equals(d)
                ? _
                : new HttpRequestFactory(_._http, u);
        };
        HttpRequestFactory.prototype.params = function (params) {
            var _ = this;
            _.throwIfDisposed();
            return _.uri(_._uriDefaults.updateQuery(params));
        };
        HttpRequestFactory.prototype.request = function (method, data) {
            var _ = this;
            _.throwIfDisposed();
            return _._http.request({
                method: method,
                uri: _._uriDefaults,
                data: data
            });
        };
        HttpRequestFactory.prototype.get = function () {
            return this.request("GET" /* GET */);
        };
        HttpRequestFactory.prototype.put = function () {
            return this.request("PUT" /* PUT */);
        };
        HttpRequestFactory.prototype.post = function (data) {
            return this.request("POST" /* POST */, data);
        };
        HttpRequestFactory.prototype['delete'] = function () {
            return this.request("DELETE" /* DELETE */);
        };
        return HttpRequestFactory;
    }(DisposableBase_1.default));
    exports.HttpRequestFactory = HttpRequestFactory;
    exports.default = HttpRequestFactory;
});
//# sourceMappingURL=HttpRequestFactory.js.map