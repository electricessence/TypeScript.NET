"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArgumentException_1 = require('./ArgumentException');
'use strict';
var NAME = 'ArgumentOutOfRangeException';
var ArgumentOutOfRangeException = (function (_super) {
    __extends(ArgumentOutOfRangeException, _super);
    function ArgumentOutOfRangeException(paramName, actualValue, message, innerException) {
        if (message === void 0) { message = ' '; }
        if (innerException === void 0) { innerException = null; }
        _super.call(this, paramName, message, innerException, function (_) {
            _.actualValue = actualValue;
        });
    }
    ArgumentOutOfRangeException.prototype.getName = function () {
        return NAME;
    };
    return ArgumentOutOfRangeException;
}(ArgumentException_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArgumentOutOfRangeException;
//# sourceMappingURL=ArgumentOutOfRangeException.js.map