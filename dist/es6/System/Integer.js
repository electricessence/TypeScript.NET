/*
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
    function random(max) {
        return (Math.random() * max) | 0;
    }
    Integer.random = random;
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