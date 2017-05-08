/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { DisposableBase } from "../../Disposable/DisposableBase";
import { HttpMethod } from "./HttpMethod";
import { Uri } from "../../Uri/Uri";
// noinspection JSUnusedLocalSymbols
const NAME = 'HttpRequestFactory';
/**
 * This class exposes a factory for making requests to prepared uri and params.
 */
export class HttpRequestFactory extends DisposableBase {
    constructor(_http, uriDefaults) {
        super();
        this._http = _http;
        this._disposableObjectName = NAME;
        if (!_http)
            throw new ArgumentNullException('_http');
        this._uriDefaults = Uri.from(uriDefaults);
    }
    _onDispose() {
        // super._onDispose(); // Not required for first level inheritance.
        this._http = null;
        this._uriDefaults = null;
    }
    uri(uri) {
        const _ = this;
        _.throwIfDisposed();
        const d = _._uriDefaults, u = Uri.from(uri, d);
        return d && u.equals(d)
            ? _
            : new HttpRequestFactory(_._http, u);
    }
    params(params) {
        const _ = this;
        _.throwIfDisposed();
        return _.uri(_._uriDefaults.updateQuery(params));
    }
    request(method, data) {
        const _ = this;
        _.throwIfDisposed();
        return _._http.request({
            method: method,
            uri: _._uriDefaults,
            data: data
        });
    }
    get() {
        return this.request(HttpMethod.GET);
    }
    put() {
        return this.request(HttpMethod.PUT);
    }
    post(data) {
        return this.request(HttpMethod.POST, data);
    }
    'delete'() {
        return this.request(HttpMethod.DELETE);
    }
}
export default HttpRequestFactory;
//# sourceMappingURL=HttpRequestFactory.js.map