"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _EnumeratorBase2 = require('./EnumeratorBase');

var _EnumeratorBase3 = _interopRequireDefault(_EnumeratorBase2);

var IndexEnumerator = (function (_EnumeratorBase) {
    _inherits(IndexEnumerator, _EnumeratorBase);

    function IndexEnumerator(sourceFactory) {
        _classCallCheck(this, IndexEnumerator);

        var source;
        _get(Object.getPrototypeOf(IndexEnumerator.prototype), "constructor", this).call(this, function () {
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
        });
    }

    return IndexEnumerator;
})(_EnumeratorBase3["default"]);

exports["default"] = IndexEnumerator;
module.exports = exports["default"];
//# sourceMappingURL=IndexEnumerator.js.map
