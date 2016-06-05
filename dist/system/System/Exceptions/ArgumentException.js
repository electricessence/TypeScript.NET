/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
System.register(["./SystemException", "../Text/Utility", "../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SystemException_1, Utility_1, extends_1;
    var __extends, NAME, ArgumentException;
    return {
        setters:[
            function (SystemException_1_1) {
                SystemException_1 = SystemException_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            NAME = 'ArgumentException';
            ArgumentException = (function (_super) {
                __extends(ArgumentException, _super);
                function ArgumentException(paramName, message, innerException, beforeSealing) {
                    if (message === void 0) { message = null; }
                    if (innerException === void 0) { innerException = null; }
                    var pn = paramName ? ('{' + paramName + '} ') : '';
                    _super.call(this, Utility_1.trim(pn + (message || '')), innerException, function (_) {
                        _.paramName = paramName;
                        if (beforeSealing)
                            beforeSealing(_);
                    });
                }
                ArgumentException.prototype.getName = function () {
                    return NAME;
                };
                return ArgumentException;
            }(SystemException_1.SystemException));
            exports_1("ArgumentException", ArgumentException);
            exports_1("default",ArgumentException);
        }
    }
});
//# sourceMappingURL=ArgumentException.js.map