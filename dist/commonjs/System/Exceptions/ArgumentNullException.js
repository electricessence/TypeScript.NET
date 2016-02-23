'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArgumentException_1 = require('./ArgumentException');
var NAME = 'ArgumentNullException';
var ArgumentNullException = (function (_super) {
    __extends(ArgumentNullException, _super);
    function ArgumentNullException(paramName, message, innerException) {
        if (message === void 0) { message = ''; }
        if (innerException === void 0) { innerException = null; }
        _super.call(this, paramName, message, innerException);
    }
    ArgumentNullException.prototype.getName = function () {
        return NAME;
    };
    return ArgumentNullException;
}(ArgumentException_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArgumentNullException;
//# sourceMappingURL=ArgumentNullException.js.map