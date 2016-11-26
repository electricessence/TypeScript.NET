(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod.OPTIONS = 'OPTIONS', HttpMethod.HEAD = 'HEAD', HttpMethod.GET = 'GET', HttpMethod.PUT = 'PUT', HttpMethod.POST = 'POST', HttpMethod.DELETE = 'DELETE', HttpMethod.TRACE = 'TRACE', HttpMethod.CONNECT = 'CONNECT';
    })(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
});
//# sourceMappingURL=HttpMethod.js.map