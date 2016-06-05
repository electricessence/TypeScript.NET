/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var ReadOnlyCollectionBase_1 = require("../ReadOnlyCollectionBase");
var Enumerator_1 = require("../Enumeration/Enumerator");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;

var ReadOnlyArrayWrapper = function (_ReadOnlyCollectionBa) {
    _inherits(ReadOnlyArrayWrapper, _ReadOnlyCollectionBa);

    function ReadOnlyArrayWrapper(array) {
        _classCallCheck(this, ReadOnlyArrayWrapper);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReadOnlyArrayWrapper).call(this));

        if (!array) throw new ArgumentNullException_1.ArgumentNullException('array');
        var _ = _this;
        _._getCount = function () {
            return array.length;
        };
        _.getEnumerator = function () {
            return Enumerator_1.from(array);
        };
        _.getValueAt = function (i) {
            return array[i];
        };
        return _this;
    }

    return ReadOnlyArrayWrapper;
}(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadOnlyArrayWrapper;
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map
