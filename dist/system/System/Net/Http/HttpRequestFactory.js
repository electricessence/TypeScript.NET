System.register(["../../Exceptions/ArgumentNullException", "../../Disposable/DisposableBase", "./HttpMethod", "../../Uri/Uri", "../../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ArgumentNullException_1, DisposableBase_1, HttpMethod_1, Uri_1, extends_1, __extends, NAME, HttpRequestFactory;
    return {
        setters: [
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
            }
        ],
        execute: function () {
            __extends = extends_1.default;
            NAME = 'HttpRequestFactory';
            HttpRequestFactory = (function (_super) {
                __extends(HttpRequestFactory, _super);
                function HttpRequestFactory(_http, uriDefaults) {
                    var _this = _super.call(this) || this;
                    _this._http = _http;
                    _this._disposableObjectName = NAME;
                    if (!_http)
                        throw new ArgumentNullException_1.ArgumentNullException('_http');
                    _this._uriDefaults = Uri_1.Uri.from(uriDefaults);
                    return _this;
                }
                HttpRequestFactory.prototype._onDispose = function () {
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
    };
});
//# sourceMappingURL=HttpRequestFactory.js.map