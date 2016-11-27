System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HttpMethod;
    return {
        setters: [],
        execute: function () {
            (function (HttpMethod) {
                HttpMethod.OPTIONS = 'OPTIONS', HttpMethod.HEAD = 'HEAD', HttpMethod.GET = 'GET', HttpMethod.PUT = 'PUT', HttpMethod.POST = 'POST', HttpMethod.DELETE = 'DELETE', HttpMethod.TRACE = 'TRACE', HttpMethod.CONNECT = 'CONNECT';
            })(HttpMethod = HttpMethod || (HttpMethod = {}));
            exports_1("HttpMethod", HttpMethod);
        }
    };
});
//# sourceMappingURL=HttpMethod.js.map