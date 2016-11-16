System.register(["./SystemException", "../Text/Utility", "../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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