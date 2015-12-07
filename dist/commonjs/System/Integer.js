/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Types = require('./Types');

var _Types2 = _interopRequireDefault(_Types);

var _ExceptionsArgumentException = require('./Exceptions/ArgumentException');

var _ExceptionsArgumentException2 = _interopRequireDefault(_ExceptionsArgumentException);

function Integer(n) {
    return n | 0;
}
var Integer;
(function (Integer) {
    function r(max) {
        return Math.random() * max | 0;
    }
    function random(max) {
        assert(max, 'max');
        if (max == 0) return 0;
        max += max > 0 ? 1 : -1;
        return r(max);
    }
    Integer.random = random;
    var random;
    (function (random) {
        function under(boundary) {
            return r(boundary);
        }
        random.under = under;
    })(random = Integer.random || (Integer.random = {}));
    function is(n) {
        return _Types2['default'].isNumber(n, false) && n == (n | 0);
    }
    Integer.is = is;
    function assert(n, argumentName) {
        var i = is(n);
        if (!i) {
            throw new _ExceptionsArgumentException2['default'](argumentName || 'n', "Must be an integer.");
        }
        return i;
    }
    Integer.assert = assert;
})(Integer || (Integer = {}));
exports['default'] = Integer;
module.exports = exports['default'];
//# sourceMappingURL=Integer.js.map
