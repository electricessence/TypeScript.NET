/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Exceptions/ArgumentNullException", "../../Disposable/DisposableBase", "./HttpMethod", "../../Uri/Uri", "../../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ArgumentNullException_1, DisposableBase_1, HttpMethod_1, Uri_1, extends_1;
    var __extends, HttpRequestFactory;
    return {
        setters:[
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (HttpMethod_1_1) {
                HttpMethod_1 = HttpMethod_1_1;
            },
            function (Uri_1_1) {
                Uri_1 = Uri_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            HttpRequestFactory = (function (_super) {
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
            exports_1("default", HttpRequestFactory);
        }
    }
});
//# sourceMappingURL=HttpRequestFactory.js.map