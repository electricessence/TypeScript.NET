/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SystemException_1 = require("./SystemException");
var Utility_1 = require("../Text/Utility");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var NAME = 'ArgumentException';

var ArgumentException = function (_SystemException_1$Sy) {
    _inherits(ArgumentException, _SystemException_1$Sy);

    function ArgumentException(paramName) {
        var message = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var innerException = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var beforeSealing = arguments[3];

        _classCallCheck(this, ArgumentException);

        var pn = paramName ? '{' + paramName + '} ' : '';
        return _possibleConstructorReturn(this, Object.getPrototypeOf(ArgumentException).call(this, Utility_1.trim(pn + (message || '')), innerException, function (_) {
            _.paramName = paramName;
            if (beforeSealing) beforeSealing(_);
        }));
    }

    _createClass(ArgumentException, [{
        key: "getName",
        value: function getName() {
            return NAME;
        }
    }]);

    return ArgumentException;
}(SystemException_1.SystemException);

exports.ArgumentException = ArgumentException;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArgumentException;
//# sourceMappingURL=ArgumentException.js.map
