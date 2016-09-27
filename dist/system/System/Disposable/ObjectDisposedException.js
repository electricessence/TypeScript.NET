/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
System.register(["../Exceptions/InvalidOperationException", "../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var InvalidOperationException_1, extends_1;
    var __extends, NAME, ObjectDisposedException;
    return {
        setters:[
            function (InvalidOperationException_1_1) {
                InvalidOperationException_1 = InvalidOperationException_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            NAME = 'ObjectDisposedException';
            ObjectDisposedException = (function (_super) {
                __extends(ObjectDisposedException, _super);
                function ObjectDisposedException(objectName, message, innerException) {
                    if (message === void 0) { message = null; }
                    if (innerException === void 0) { innerException = null; }
                    _super.call(this, message, innerException, function (_) {
                        _.objectName = objectName;
                    });
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
                };
                return ObjectDisposedException;
            }(InvalidOperationException_1.InvalidOperationException));
            exports_1("ObjectDisposedException", ObjectDisposedException);
            exports_1("default",ObjectDisposedException);
        }
    }
});
//# sourceMappingURL=ObjectDisposedException.js.map