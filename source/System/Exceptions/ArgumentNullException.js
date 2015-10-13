/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './ArgumentException'], function (require, exports, ArgumentException_1) {
    var NAME = 'ArgumentNullException';
    var ArgumentNullException = (function (_super) {
        __extends(ArgumentNullException, _super);
        function ArgumentNullException() {
            _super.apply(this, arguments);
        }
        ArgumentNullException.prototype.getName = function () {
            return NAME;
        };
        return ArgumentNullException;
    })(ArgumentException_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArgumentNullException;
});
//# sourceMappingURL=ArgumentNullException.js.map