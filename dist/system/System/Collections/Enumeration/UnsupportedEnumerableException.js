/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
System.register(["../../Exceptions/SystemException", "../../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SystemException_1, extends_1;
    var __extends, NAME, UnsupportedEnumerableException;
    return {
        setters:[
            function (SystemException_1_1) {
                SystemException_1 = SystemException_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            NAME = 'UnsupportedEnumerableException';
            UnsupportedEnumerableException = (function (_super) {
                __extends(UnsupportedEnumerableException, _super);
                function UnsupportedEnumerableException(message) {
                    _super.call(this, message || "Unsupported enumerable.");
                }
                UnsupportedEnumerableException.prototype.getName = function () {
                    return NAME;
                };
                return UnsupportedEnumerableException;
            }(SystemException_1.SystemException));
            exports_1("UnsupportedEnumerableException", UnsupportedEnumerableException);
            exports_1("default",UnsupportedEnumerableException);
        }
    }
});
//# sourceMappingURL=UnsupportedEnumerableException.js.map