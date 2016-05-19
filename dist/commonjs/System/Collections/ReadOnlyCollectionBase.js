/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollectionBase_1 = require("./CollectionBase");

var ReadOnlyCollectionBase = function (_CollectionBase_1$Col) {
    _inherits(ReadOnlyCollectionBase, _CollectionBase_1$Col);

    function ReadOnlyCollectionBase() {
        _classCallCheck(this, ReadOnlyCollectionBase);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ReadOnlyCollectionBase).apply(this, arguments));
    }

    _createClass(ReadOnlyCollectionBase, [{
        key: "getCount",
        value: function getCount() {
            return this._getCount();
        }
    }, {
        key: "getIsReadOnly",
        value: function getIsReadOnly() {
            return true;
        }
    }, {
        key: "_addInternal",
        value: function _addInternal(entry) {
            return false;
        }
    }, {
        key: "_removeInternal",
        value: function _removeInternal(entry, max) {
            return 0;
        }
    }, {
        key: "_clearInternal",
        value: function _clearInternal() {
            return 0;
        }
    }, {
        key: "getEnumerator",
        value: function getEnumerator() {
            return this._getEnumerator();
        }
    }]);

    return ReadOnlyCollectionBase;
}(CollectionBase_1.CollectionBase);

exports.ReadOnlyCollectionBase = ReadOnlyCollectionBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadOnlyCollectionBase;
//# sourceMappingURL=ReadOnlyCollectionBase.js.map
