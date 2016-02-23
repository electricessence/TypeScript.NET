/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Type from './Types';
import ArgumentException from './Exceptions/ArgumentException';
function Integer(n) {
    return n | 0;
}
var Integer;
(function (Integer) {
    function r(max) {
        return (Math.random() * max) | 0;
    }
    function random(max) {
        assert(max, 'max');
        if (max == 0)
            return 0;
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
        return Type.isNumber(n, false) && n == (n | 0);
    }
    Integer.is = is;
    function assert(n, argumentName) {
        var i = is(n);
        if (!i) {
            throw new ArgumentException(argumentName || 'n', "Must be an integer.");
        }
        return i;
    }
    Integer.assert = assert;
})(Integer || (Integer = {}));
export default Integer;
//# sourceMappingURL=Integer.js.map