"use strict";
var SystemException_1 = require("./SystemException");
var Utility_1 = require("../Text/Utility");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var NAME = 'ArgumentException';
var ArgumentException = (function (_super) {
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
exports.ArgumentException = ArgumentException;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArgumentException;
//# sourceMappingURL=ArgumentException.js.map