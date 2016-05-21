/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./RegularExpressions", "../Collections/Enumeration/EmptyEnumerator", "../Collections/Enumeration/EnumeratorBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var RegularExpressions_1, EmptyEnumerator_1, EnumeratorBase_1;
    var RegexMatchEnumerator;
    return {
        setters:[
            function (RegularExpressions_1_1) {
                RegularExpressions_1 = RegularExpressions_1_1;
            },
            function (EmptyEnumerator_1_1) {
                EmptyEnumerator_1 = EmptyEnumerator_1_1;
            },
            function (EnumeratorBase_1_1) {
                EnumeratorBase_1 = EnumeratorBase_1_1;
            }],
        execute: function() {
            RegexMatchEnumerator = (function () {
                function RegexMatchEnumerator(pattern) {
                    if (pattern instanceof RegularExpressions_1.Regex) {
                        this._pattern = pattern;
                    }
                    else {
                        this._pattern = new RegularExpressions_1.Regex(pattern);
                    }
                }
                RegexMatchEnumerator.prototype.matches = function (input) {
                    var _this = this;
                    var p;
                    return new EnumeratorBase_1.EnumeratorBase(function () {
                        p = 0;
                    }, function (yielder) {
                        var match = _this._pattern.match(input, p);
                        if (match.success) {
                            p = match.index + match.length;
                            return yielder.yieldReturn(match);
                        }
                        return yielder.yieldBreak();
                    });
                };
                RegexMatchEnumerator.matches = function (input, pattern) {
                    return input && pattern
                        ? (new RegexMatchEnumerator(pattern)).matches(input)
                        : EmptyEnumerator_1.EmptyEnumerator;
                };
                return RegexMatchEnumerator;
            }());
            exports_1("RegexMatchEnumerator", RegexMatchEnumerator);
            exports_1("default",RegexMatchEnumerator.matches);
        }
    }
});
//# sourceMappingURL=RegexMatchEnumerator.js.map