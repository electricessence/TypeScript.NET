/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
System.register(["./ArgumentException", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var ArgumentException_1, extends_1, __extends, NAME, ArgumentNullException;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (ArgumentException_1_1) {
                ArgumentException_1 = ArgumentException_1_1;
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
            NAME = 'ArgumentNullException';
            ArgumentNullException = /** @class */ (function (_super) {
                __extends(ArgumentNullException, _super);
                function ArgumentNullException(paramName, message, innerException) {
                    if (message === void 0) { message = "'" + paramName + "' is null (or undefined)."; }
                    return _super.call(this, paramName, message, innerException) || this;
                }
                ArgumentNullException.prototype.getName = function () {
                    return NAME;
                };
                return ArgumentNullException;
            }(ArgumentException_1.ArgumentException));
            exports_1("ArgumentNullException", ArgumentNullException);
            exports_1("default", ArgumentNullException);
        }
    };
});
//# sourceMappingURL=ArgumentNullException.js.map