/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
System.register(["../Exception"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Exception_1;
    var NAME, SystemException;
    return {
        setters:[
            function (Exception_1_1) {
                Exception_1 = Exception_1_1;
            }],
        execute: function() {
            NAME = 'SystemException';
            SystemException = (function (_super) {
                __extends(SystemException, _super);
                function SystemException() {
                    _super.apply(this, arguments);
                }
                SystemException.prototype.getName = function () {
                    return NAME;
                };
                return SystemException;
            }(Exception_1.Exception));
            exports_1("SystemException", SystemException);
            exports_1("default",SystemException);
        }
    }
});
//# sourceMappingURL=SystemException.js.map