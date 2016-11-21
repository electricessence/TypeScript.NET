/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
System.register(["../Exception", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Exception_1, extends_1, __extends, NAME, SystemException;
    return {
        setters: [
            function (Exception_1_1) {
                Exception_1 = Exception_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            NAME = 'SystemException';
            SystemException = (function (_super) {
                __extends(SystemException, _super);
                function SystemException() {
                    return _super.apply(this, arguments) || this;
                }
                /*
                    constructor(
                        message:string = null,
                        innerException:Error = null,
                        beforeSealing?:(ex:any)=>void)
                    {
                        super(message, innerException, beforeSealing);
                    }
                */
                SystemException.prototype.getName = function () {
                    return NAME;
                };
                return SystemException;
            }(Exception_1.Exception));
            exports_1("SystemException", SystemException);
            exports_1("default", SystemException);
        }
    };
});
//# sourceMappingURL=SystemException.js.map