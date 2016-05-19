/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var DisposableBase_1 = require("../../Disposable/DisposableBase");
var HttpMethod_1 = require("./HttpMethod");
var Uri_1 = require("../../Uri/Uri");

var HttpRequestFactory = function (_DisposableBase_1$Dis) {
    _inherits(HttpRequestFactory, _DisposableBase_1$Dis);

    function HttpRequestFactory(_http, uriDefaults) {
        _classCallCheck(this, HttpRequestFactory);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HttpRequestFactory).call(this));

        _this._http = _http;
        _this._disposableObjectName = 'HttpRequestFactory';
        if (!_http) throw new ArgumentNullException_1.ArgumentNullException('_http');
        _this._uriDefaults = Uri_1.Uri.from(uriDefaults);
        return _this;
    }

    _createClass(HttpRequestFactory, [{
        key: "_onDispose",
        value: function _onDispose() {
            this._http = null;
            this._uriDefaults = null;
        }
    }, {
        key: "uri",
        value: function uri(_uri) {
            var _ = this;
            _.throwIfDisposed();
            var u = Uri_1.Uri.from(_uri, _._uriDefaults);
            return _._uriDefaults.equals(u) ? _ : new HttpRequestFactory(_._http, u);
        }
    }, {
        key: "params",
        value: function params(_params) {
            var _ = this;
            _.throwIfDisposed();
            return _.uri(_._uriDefaults.updateQuery(_params));
        }
    }, {
        key: "request",
        value: function request(method, data) {
            var _ = this;
            _.throwIfDisposed();
            return _._http.request({
                method: method,
                uri: _._uriDefaults,
                data: data
            });
        }
    }, {
        key: "get",
        value: function get() {
            return this.request(HttpMethod_1.GET);
        }
    }, {
        key: "put",
        value: function put() {
            return this.request(HttpMethod_1.PUT);
        }
    }, {
        key: "post",
        value: function post(data) {
            return this.request(HttpMethod_1.POST, data);
        }
    }, {
        key: 'delete',
        value: function _delete() {
            return this.request(HttpMethod_1.DELETE);
        }
    }]);

    return HttpRequestFactory;
}(DisposableBase_1.DisposableBase);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HttpRequestFactory;
//# sourceMappingURL=HttpRequestFactory.js.map
