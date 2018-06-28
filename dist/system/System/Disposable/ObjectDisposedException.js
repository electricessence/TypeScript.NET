/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
System.register(["../Exceptions/InvalidOperationException", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var InvalidOperationException_1, extends_1, __extends, NAME, ObjectDisposedException;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (InvalidOperationException_1_1) {
                InvalidOperationException_1 = InvalidOperationException_1_1;
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
            NAME = 'ObjectDisposedException';
            ObjectDisposedException = /** @class */ (function (_super) {
                __extends(ObjectDisposedException, _super);
                // For simplicity and consistency, lets stick with 1 signature.
                function ObjectDisposedException(objectName, message, innerException) {
                    return _super.call(this, message || '', innerException, function (_) {
                        _.objectName = objectName;
                    }) || this;
                }
                ObjectDisposedException.prototype.getName = function () {
                    return NAME;
                };
                ObjectDisposedException.prototype.toString = function () {
                    var _ = this;
                    var oName = _.objectName;
                    oName = oName ? ('{' + oName + '} ') : '';
                    return '[' + _.name + ': ' + oName + _.message + ']';
                };
                ObjectDisposedException.throwIfDisposed = function (disposable, objectName, message) {
                    if (disposable.wasDisposed)
                        throw new ObjectDisposedException(objectName, message);
                    return true;
                };
                return ObjectDisposedException;
            }(InvalidOperationException_1.InvalidOperationException));
            exports_1("ObjectDisposedException", ObjectDisposedException);
            exports_1("default", ObjectDisposedException);
        }
    };
});
//# sourceMappingURL=ObjectDisposedException.js.map