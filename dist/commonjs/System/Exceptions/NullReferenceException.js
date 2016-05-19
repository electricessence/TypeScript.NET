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
var NAME = 'NullReferenceException';

var NullReferenceException = function (_SystemException_1$Sy) {
    _inherits(NullReferenceException, _SystemException_1$Sy);

    function NullReferenceException() {
        _classCallCheck(this, NullReferenceException);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(NullReferenceException).apply(this, arguments));
    }

    _createClass(NullReferenceException, [{
        key: "getName",
        value: function getName() {
            return NAME;
        }
    }]);

    return NullReferenceException;
}(SystemException_1.SystemException);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NullReferenceException;
//# sourceMappingURL=NullReferenceException.js.map
