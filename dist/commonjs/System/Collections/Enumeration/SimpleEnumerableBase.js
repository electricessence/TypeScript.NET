/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IteratorResult_1 = require("./IteratorResult");
var VOID0 = void 0;

var SimpleEnumerableBase = function () {
    function SimpleEnumerableBase() {
        _classCallCheck(this, SimpleEnumerableBase);

        this.reset();
    }

    _createClass(SimpleEnumerableBase, [{
        key: "incrementIndex",
        value: function incrementIndex() {
            var i = this._index;
            this._index = i = i === VOID0 ? 0 : i + 1;
            return i;
        }
    }, {
        key: "nextValue",
        value: function nextValue() {
            this.moveNext();
            return this._current;
        }
    }, {
        key: "next",
        value: function next() {
            return this.moveNext() ? new IteratorResult_1.IteratorResult(this._current, this._index) : IteratorResult_1.IteratorResult.Done;
        }
    }, {
        key: 'return',
        value: function _return(value) {
            try {
                return value !== VOID0 && this.canMoveNext() ? new IteratorResult_1.IteratorResult(value, VOID0, true) : IteratorResult_1.IteratorResult.Done;
            } finally {
                this.dispose();
            }
        }
    }, {
        key: "reset",
        value: function reset() {
            this._current = VOID0;
            this._index = VOID0;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.reset();
        }
    }, {
        key: "getIsEndless",
        value: function getIsEndless() {
            return this.canMoveNext();
        }
    }, {
        key: "current",
        get: function get() {
            return this._current;
        }
    }, {
        key: "isEndless",
        get: function get() {
            return this.getIsEndless();
        }
    }]);

    return SimpleEnumerableBase;
}();

exports.SimpleEnumerableBase = SimpleEnumerableBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleEnumerableBase;
//# sourceMappingURL=SimpleEnumerableBase.js.map
