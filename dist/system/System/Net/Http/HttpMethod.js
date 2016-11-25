/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HttpMethod;
    return {
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * Based on: https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
             */
            (function (HttpMethod) {
                HttpMethod.OPTIONS = 'OPTIONS', HttpMethod.HEAD = 'HEAD', HttpMethod.GET = 'GET', HttpMethod.PUT = 'PUT', HttpMethod.POST = 'POST', HttpMethod.DELETE = 'DELETE', HttpMethod.TRACE = 'TRACE', HttpMethod.CONNECT = 'CONNECT';
            })(HttpMethod || (HttpMethod = {}));
            exports_1("HttpMethod", HttpMethod);
        }
    };
});
//# sourceMappingURL=HttpMethod.js.map