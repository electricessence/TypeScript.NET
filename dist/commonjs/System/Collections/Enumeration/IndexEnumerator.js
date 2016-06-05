/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumeratorBase_1 = require("./EnumeratorBase");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;

var IndexEnumerator = function (_EnumeratorBase_1$Enu) {
    _inherits(IndexEnumerator, _EnumeratorBase_1$Enu);

    function IndexEnumerator(sourceFactory) {
        _classCallCheck(this, IndexEnumerator);

        var source;

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IndexEnumerator).call(this, function () {
            source = sourceFactory();
            if (source && source.source) {
                var len = source.length;
                if (len < 0) throw new Error("length must be zero or greater");
                if (!isFinite(len)) throw new Error("length must finite number");
                if (len && source.step === 0) throw new Error("Invalid IndexEnumerator step value (0).");
                var pointer = source.pointer;
                if (!pointer) pointer = 0;else if (pointer != Math.floor(pointer)) throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                source.pointer = pointer;
                var step = source.step;
                if (!step) step = 1;else if (step != Math.floor(step)) throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                source.step = step;
            }
        }, function (yielder) {
            var len = source && source.source ? source.length : 0;
            if (!len || isNaN(len)) return yielder.yieldBreak();
            var current = source.pointer;
            source.pointer += source.step;
            return current < len && current >= 0 ? yielder.yieldReturn(source.source[current]) : yielder.yieldBreak();
        }, function () {
            if (source) {
                source.source = null;
            }
        }));

        _this._isEndless = false;
        return _this;
    }

    return IndexEnumerator;
}(EnumeratorBase_1.EnumeratorBase);

exports.IndexEnumerator = IndexEnumerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexEnumerator;
//# sourceMappingURL=IndexEnumerator.js.map
