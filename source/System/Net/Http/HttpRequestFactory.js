/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
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
        define(["require", "exports", "../../Exceptions/ArgumentNullException", "../../Disposable/DisposableBase", "./HttpMethod", "../../Uri/Uri"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var DisposableBase_1 = require("../../Disposable/DisposableBase");
    var HttpMethod_1 = require("./HttpMethod");
    var Uri_1 = require("../../Uri/Uri");
    var HttpRequestFactory = (function (_super) {
        __extends(HttpRequestFactory, _super);
        function HttpRequestFactory(_http, uriDefaults) {
            _super.call(this);
            this._http = _http;
            this._disposableObjectName = 'HttpRequestFactory';
            if (!_http)
                throw new ArgumentNullException_1.ArgumentNullException('_http');
            this._uriDefaults = Uri_1.Uri.from(uriDefaults);
        }
        HttpRequestFactory.prototype._onDispose = function () {
            this._http = null;
            this._uriDefaults = null;
        };
        HttpRequestFactory.prototype.uri = function (uri) {
            var _ = this;
            _.throwIfDisposed();
            var u = Uri_1.Uri.from(uri, _._uriDefaults);
            return _._uriDefaults.equals(u)
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
            return this.request(HttpMethod_1.GET);
        };
        HttpRequestFactory.prototype.put = function () {
            return this.request(HttpMethod_1.PUT);
        };
        HttpRequestFactory.prototype.post = function (data) {
            return this.request(HttpMethod_1.POST, data);
        };
        HttpRequestFactory.prototype['delete'] = function () {
            return this.request(HttpMethod_1.DELETE);
        };
        return HttpRequestFactory;
    }(DisposableBase_1.DisposableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HttpRequestFactory;
});
//# sourceMappingURL=HttpRequestFactory.js.map