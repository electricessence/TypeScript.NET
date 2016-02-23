var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './SystemException'], factory);
    }
})(function (require, exports) {
    'use strict';
    var SystemException_1 = require('./SystemException');
    var NAME = 'InvalidOperationException';
    var InvalidOperationException = (function (_super) {
        __extends(InvalidOperationException, _super);
        function InvalidOperationException() {
            _super.apply(this, arguments);
        }
        InvalidOperationException.prototype.getName = function () {
            return NAME;
        };
        return InvalidOperationException;
    }(SystemException_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InvalidOperationException;
});
//# sourceMappingURL=InvalidOperationException.js.map