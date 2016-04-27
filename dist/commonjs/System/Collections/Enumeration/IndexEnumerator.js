/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumeratorBase_1 = require('./EnumeratorBase');

var IndexEnumerator = function (_EnumeratorBase_1$def) {
    _inherits(IndexEnumerator, _EnumeratorBase_1$def);

    function IndexEnumerator(sourceFactory) {
        _classCallCheck(this, IndexEnumerator);

        var source;
        return _possibleConstructorReturn(this, Object.getPrototypeOf(IndexEnumerator).call(this, function () {
            source = sourceFactory();
            if (source && source.source) {
                if (source.length && source.step === 0) throw new Error("Invalid IndexEnumerator step value (0).");
                var pointer = source.pointer;
                if (!pointer) source.pointer = 0;else if (pointer != Math.floor(pointer)) throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                source.pointer = pointer;
                var step = source.step;
                if (!step) source.step = 1;else if (step != Math.floor(step)) throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                source.step = step;
            }
        }, function (yielder) {
            var len = source && source.source ? source.length : 0;
            if (!len) return yielder.yieldBreak();
            var current = source.pointer;
            source.pointer += source.step;
            return current < len && current >= 0 ? yielder.yieldReturn(source.source[current]) : yielder.yieldBreak();
        }, function () {
            if (source) {
                source.source = null;
            }
        }));
    }

    return IndexEnumerator;
}(EnumeratorBase_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexEnumerator;
//# sourceMappingURL=IndexEnumerator.js.map
