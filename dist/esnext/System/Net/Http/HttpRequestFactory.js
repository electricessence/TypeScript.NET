/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { DisposableBase } from "../../Disposable/DisposableBase";
import { HttpMethod } from "./HttpMethod";
import { Uri } from "../../Uri/Uri";
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
            throw new ArgumentNullException('_http');
        _this._uriDefaults = Uri.from(uriDefaults);
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
        var d = _._uriDefaults, u = Uri.from(uri, d);
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
        return this.request(HttpMethod.GET);
    };
    HttpRequestFactory.prototype.put = function () {
        return this.request(HttpMethod.PUT);
    };
    HttpRequestFactory.prototype.post = function (data) {
        return this.request(HttpMethod.POST, data);
    };
    HttpRequestFactory.prototype['delete'] = function () {
        return this.request(HttpMethod.DELETE);
    };
    return HttpRequestFactory;
}(DisposableBase));
export { HttpRequestFactory };
export default HttpRequestFactory;
//# sourceMappingURL=HttpRequestFactory.js.map