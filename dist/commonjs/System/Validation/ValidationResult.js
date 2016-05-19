/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var valid = new ValidationResult(true);

var ValidationResult = function () {
    function ValidationResult() {
        var isValid = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
        var message = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var data = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        _classCallCheck(this, ValidationResult);

        this.isValid = isValid;
        this.message = message;
        this.data = data;
        Object.freeze(this);
    }

    _createClass(ValidationResult, [{
        key: "equals",
        value: function equals(other) {
            var _ = this;
            return _.isValid === other.isValid && _.message == _.message && _.data == _.data;
        }
    }], [{
        key: "invalid",
        value: function invalid(message) {
            var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            return new ValidationResult(false, message, data);
        }
    }, {
        key: "valid",
        get: function get() {
            return valid;
        }
    }]);

    return ValidationResult;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValidationResult;
//# sourceMappingURL=ValidationResult.js.map
