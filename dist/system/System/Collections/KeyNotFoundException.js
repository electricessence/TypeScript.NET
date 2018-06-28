/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */
System.register(["../Exceptions/SystemException", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var SystemException_1, extends_1, __extends, NAME, KeyNotFoundException;
    var __moduleName = context_1 && context_1.id;
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
             * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            NAME = 'KeyNotFoundException ';
            KeyNotFoundException = /** @class */ (function (_super) {
                __extends(KeyNotFoundException, _super);
                function KeyNotFoundException() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                KeyNotFoundException.prototype.getName = function () {
                    return NAME;
                };
                return KeyNotFoundException;
            }(SystemException_1.SystemException));
            exports_1("KeyNotFoundException", KeyNotFoundException);
            exports_1("default", KeyNotFoundException);
        }
    };
});
//# sourceMappingURL=KeyNotFoundException.js.map