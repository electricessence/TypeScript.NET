/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
System.register(["./SystemException", "../Text/Utility", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SystemException_1, Utility_1, extends_1, __extends, NAME, ArgumentException;
    return {
        setters: [
            function (SystemException_1_1) {
                SystemException_1 = SystemException_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            NAME = 'ArgumentException';
            ArgumentException = (function (_super) {
                __extends(ArgumentException, _super);
                // For simplicity and consistency, lets stick with 1 signature.
                function ArgumentException(paramName, message, innerException, beforeSealing) {
                    var _this = this;
                    var pn = paramName ? ('{' + paramName + '} ') : '';
                    _this = _super.call(this, Utility_1.trim(pn + (message || '')), innerException, function (_) {
                        _.paramName = paramName;
                        if (beforeSealing)
                            beforeSealing(_);
                    }) || this;
                    return _this;
                }
                ArgumentException.prototype.getName = function () {
                    return NAME;
                };
                return ArgumentException;
            }(SystemException_1.SystemException));
            exports_1("ArgumentException", ArgumentException);
            exports_1("default", ArgumentException);
        }
    };
});
//# sourceMappingURL=ArgumentException.js.map