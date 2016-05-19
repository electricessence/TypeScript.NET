/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAME = 'Exception';

var Exception = function () {
    function Exception() {
        var message = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        var innerException = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var beforeSealing = arguments[2];

        _classCallCheck(this, Exception);

        this.message = message;
        var _ = this;
        _.name = _.getName();
        _.data = {};
        if (innerException) _.data['innerException'] = innerException;
        if (beforeSealing) beforeSealing(_);
        try {
            var stack = new Error().stack;
            stack = stack && stack.replace(/^Error\n/, '').replace(/(.|\n)+\s+at new.+/, '') || '';
            this.stack = _.toStringWithoutBrackets() + stack;
        } catch (ex) {}
        Object.freeze(_);
    }

    _createClass(Exception, [{
        key: 'getName',
        value: function getName() {
            return NAME;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '[' + this.toStringWithoutBrackets() + ']';
        }
    }, {
        key: 'toStringWithoutBrackets',
        value: function toStringWithoutBrackets() {
            var _ = this,
                m = _.message;
            return _.name + (m ? ': ' + m : '');
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            var data = this.data;
            for (var k in data) {
                if (data.hasOwnProperty(k)) delete data[k];
            }
        }
    }]);

    return Exception;
}();

exports.Exception = Exception;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Exception;
//# sourceMappingURL=Exception.js.map
