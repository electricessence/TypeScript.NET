/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['./Types', './Exceptions/ArgumentException'], function(exports_1) {
    var Types_1, ArgumentException_1;
    var Integer;
    function Integer(n) {
        return n | 0;
    }
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (ArgumentException_1_1) {
                ArgumentException_1 = ArgumentException_1_1;
            }],
        execute: function() {
            (function (Integer) {
                function random(max) {
                    return (Math.random() * max) | 0;
                }
                Integer.random = random;
                function is(n) {
                    return Types_1.default.isNumber(n, false) && n == (n | 0);
                }
                Integer.is = is;
                function assert(n, argumentName) {
                    var i = is(n);
                    if (!i) {
                        throw new ArgumentException_1.default(argumentName || 'n', "Must be an integer.");
                    }
                    return i;
                }
                Integer.assert = assert;
            })(Integer || (Integer = {}));
            exports_1("default",Integer);
        }
    }
});
//# sourceMappingURL=Integer.js.map