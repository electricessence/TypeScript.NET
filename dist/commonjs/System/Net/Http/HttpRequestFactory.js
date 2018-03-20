"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var DisposableBase_1 = require("../../Disposable/DisposableBase");
var HttpMethod_1 = require("./HttpMethod");
var Uri_1 = require("../../Uri/Uri");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var NAME = 'HttpRequestFactory';
/**
 * This class exposes a factory for making requests to prepared uri and params.
 */
var HttpRequestFactory = /** @class */ (function (_super) {
    __extends(HttpRequestFactory, _super);
    function HttpRequestFactory(_http, uriDefaults) {
        var _this = _super.call(this, NAME) || this;
        _this._http = _http;
        if (!_http)
            throw new ArgumentNullException_1.ArgumentNullException('_http');
        _this._uriDefaults = Uri_1.Uri.from(uriDefaults);
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
        var d = _._uriDefaults, u = Uri_1.Uri.from(uri, d);
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
        return this.request(HttpMethod_1.HttpMethod.GET);
    };
    HttpRequestFactory.prototype.put = function () {
        return this.request(HttpMethod_1.HttpMethod.PUT);
    };
    HttpRequestFactory.prototype.post = function (data) {
        return this.request(HttpMethod_1.HttpMethod.POST, data);
    };
    HttpRequestFactory.prototype['delete'] = function () {
        return this.request(HttpMethod_1.HttpMethod.DELETE);
    };
    return HttpRequestFactory;
}(DisposableBase_1.DisposableBase));
exports.HttpRequestFactory = HttpRequestFactory;
exports.default = HttpRequestFactory;
//# sourceMappingURL=HttpRequestFactory.js.map