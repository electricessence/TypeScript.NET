/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IndexEnumerator_1 = require("./IndexEnumerator");
var Types_1 = require("../../Types");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;

var ArrayEnumerator = function (_IndexEnumerator_1$In) {
    _inherits(ArrayEnumerator, _IndexEnumerator_1$In);

    function ArrayEnumerator(arrayOrFactory) {
        var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        _classCallCheck(this, ArrayEnumerator);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayEnumerator).call(this, function () {
            var array = Types_1.Type.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
            return {
                source: array,
                pointer: start,
                length: array ? array.length : 0,
                step: step
            };
        }));
    }

    return ArrayEnumerator;
}(IndexEnumerator_1.IndexEnumerator);

exports.ArrayEnumerator = ArrayEnumerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArrayEnumerator;
//# sourceMappingURL=ArrayEnumerator.js.map
