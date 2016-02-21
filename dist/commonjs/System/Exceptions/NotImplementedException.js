'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SystemException_1 = require('./SystemException');
var NAME = 'NotImplementedException';
var NotImplementedException = (function (_super) {
    __extends(NotImplementedException, _super);
    function NotImplementedException() {
        _super.apply(this, arguments);
    }
    NotImplementedException.prototype.getName = function () {
        return NAME;
    };
    return NotImplementedException;
}(SystemException_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotImplementedException;
//# sourceMappingURL=NotImplementedException.js.map