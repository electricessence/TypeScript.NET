'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SystemException_1 = require('./SystemException');
var NAME = 'NullReferenceException';
var NullReferenceException = (function (_super) {
    __extends(NullReferenceException, _super);
    function NullReferenceException() {
        _super.apply(this, arguments);
    }
    NullReferenceException.prototype.getName = function () {
        return NAME;
    };
    return NullReferenceException;
}(SystemException_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NullReferenceException;
//# sourceMappingURL=NullReferenceException.js.map