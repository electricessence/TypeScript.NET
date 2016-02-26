/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.OPTIONS = 'OPTIONS', exports.HEAD = 'HEAD', exports.GET = 'GET', exports.PUT = 'PUT', exports.POST = 'POST', exports.DELETE = 'DELETE', exports.TRACE = 'TRACE', exports.CONNECT = 'CONNECT';
});
//# sourceMappingURL=HttpMethod.js.map