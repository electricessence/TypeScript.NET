/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RegularExpressions_1 = require("./RegularExpressions");
var EmptyEnumerator_1 = require("../Collections/Enumeration/EmptyEnumerator");
var EnumeratorBase_1 = require("../Collections/Enumeration/EnumeratorBase");

var RegexMatchEnumerator = function () {
    function RegexMatchEnumerator(pattern) {
        _classCallCheck(this, RegexMatchEnumerator);

        if (pattern instanceof RegularExpressions_1.Regex) {
            this._pattern = pattern;
        } else {
            this._pattern = new RegularExpressions_1.Regex(pattern);
        }
    }

    _createClass(RegexMatchEnumerator, [{
        key: "matches",
        value: function matches(input) {
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
        }
    }], [{
        key: "matches",
        value: function matches(input, pattern) {
            return input && pattern ? new RegexMatchEnumerator(pattern).matches(input) : EmptyEnumerator_1.EmptyEnumerator;
        }
    }]);

    return RegexMatchEnumerator;
}();

exports.RegexMatchEnumerator = RegexMatchEnumerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegexMatchEnumerator.matches;
//# sourceMappingURL=RegexMatchEnumerator.js.map
