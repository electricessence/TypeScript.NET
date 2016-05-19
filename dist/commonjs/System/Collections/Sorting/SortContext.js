/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Values = require("../../Compare");

var SortContext = function () {
    function SortContext(_next) {
        var _comparer = arguments.length <= 1 || arguments[1] === undefined ? Values.compare : arguments[1];

        var _order = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        _classCallCheck(this, SortContext);

        this._next = _next;
        this._comparer = _comparer;
        this._order = _order;
    }

    _createClass(SortContext, [{
        key: "generateSortedIndexes",
        value: function generateSortedIndexes(source) {
            var _this = this;

            if (source == null) return [];
            var result = source.map(function (s, i) {
                return i;
            });
            result.sort(function (a, b) {
                return _this.compare(source[a], source[b]);
            });
            return result;
        }
    }, {
        key: "compare",
        value: function compare(a, b) {
            var _ = this;
            var d = _._comparer(a, b);
            if (d == 0 && _._next) return _._next.compare(a, b);
            return _._order * d;
        }
    }, {
        key: "order",
        get: function get() {
            return this._order;
        }
    }]);

    return SortContext;
}();

exports.SortContext = SortContext;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SortContext;
//# sourceMappingURL=SortContext.js.map
