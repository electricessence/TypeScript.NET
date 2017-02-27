/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
System.register(["./SystemException", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SystemException_1, extends_1, __extends, NAME, NullReferenceException;
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
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            NAME = 'NullReferenceException';
            NullReferenceException = (function (_super) {
                __extends(NullReferenceException, _super);
                function NullReferenceException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                NullReferenceException.prototype.getName = function () {
                    return NAME;
                };
                return NullReferenceException;
            }(SystemException_1.SystemException));
            exports_1("default", NullReferenceException);
        }
    };
});
//# sourceMappingURL=NullReferenceException.js.map