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

var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var NAME = 'ObjectDisposedException';

var ObjectDisposedException = function (_InvalidOperationExce) {
    _inherits(ObjectDisposedException, _InvalidOperationExce);

    function ObjectDisposedException(objectName) {
        var message = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var innerException = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        _classCallCheck(this, ObjectDisposedException);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectDisposedException).call(this, message, innerException, function (_) {
            _.objectName = objectName;
        }));
    }

    _createClass(ObjectDisposedException, [{
        key: "getName",
        value: function getName() {
            return NAME;
        }
    }, {
        key: "toString",
        value: function toString() {
            var _ = this,
                oName = _.objectName;
            oName = oName ? '{' + oName + '} ' : '';
            return '[' + _.name + ': ' + oName + _.message + ']';
        }
    }], [{
        key: "throwIfDisposed",
        value: function throwIfDisposed(disposable, objectName, message) {
            if (disposable.wasDisposed) throw new ObjectDisposedException(objectName, message);
        }
    }]);

    return ObjectDisposedException;
}(InvalidOperationException_1.InvalidOperationException);

exports.ObjectDisposedException = ObjectDisposedException;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObjectDisposedException;
//# sourceMappingURL=ObjectDisposedException.js.map
