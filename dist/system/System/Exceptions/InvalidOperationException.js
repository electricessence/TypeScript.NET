/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
System.register(["./SystemException", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SystemException_1, extends_1, __extends, NAME, InvalidOperationException;
    return {
        setters: [
            function (SystemException_1_1) {
                SystemException_1 = SystemException_1_1;
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
            __extends = extends_1.default;
            NAME = 'InvalidOperationException';
            InvalidOperationException = (function (_super) {
                __extends(InvalidOperationException, _super);
                function InvalidOperationException() {
                    return _super.apply(this, arguments) || this;
                }
                InvalidOperationException.prototype.getName = function () {
                    return NAME;
                };
                return InvalidOperationException;
            }(SystemException_1.SystemException));
            exports_1("InvalidOperationException", InvalidOperationException);
            exports_1("default", InvalidOperationException);
        }
    };
});
//# sourceMappingURL=InvalidOperationException.js.map