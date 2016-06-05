/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exception_1 = require("../Exception");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var NAME = 'SystemException';

var SystemException = function (_Exception_1$Exceptio) {
    _inherits(SystemException, _Exception_1$Exceptio);

    function SystemException() {
        _classCallCheck(this, SystemException);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SystemException).apply(this, arguments));
    }

    _createClass(SystemException, [{
        key: "getName",
        value: function getName() {
            return NAME;
        }
    }]);

    return SystemException;
}(Exception_1.Exception);

exports.SystemException = SystemException;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SystemException;
//# sourceMappingURL=SystemException.js.map
