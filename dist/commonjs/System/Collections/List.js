/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Compare_1 = require("../Compare");
var Utility_1 = require("./Array/Utility");
var Enumerator_1 = require("./Enumeration/Enumerator");
var Types_1 = require("../Types");
var ArrayEnumerator_1 = require("./Enumeration/ArrayEnumerator");
var CollectionBase_1 = require("./CollectionBase");
var extends_1 = require("../../extends");
var __extends = extends_1.default;

var List = function (_CollectionBase_1$Col) {
    _inherits(List, _CollectionBase_1$Col);

    function List(source) {
        var equalityComparer = arguments.length <= 1 || arguments[1] === undefined ? Compare_1.areEqual : arguments[1];

        _classCallCheck(this, List);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(List).call(this, null, equalityComparer));

        var _ = _this;
        if (Array.isArray(source)) {
            _._source = source.slice();
        } else {
            _._source = [];
            _._importEntries(source);
        }
        return _this;
    }

    _createClass(List, [{
        key: "getCount",
        value: function getCount() {
            return this._source.length;
        }
    }, {
        key: "_addInternal",
        value: function _addInternal(entry) {
            this._source.push(entry);
            return true;
        }
    }, {
        key: "_removeInternal",
        value: function _removeInternal(entry) {
            var max = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];

            return Utility_1.remove(this._source, entry, max, this._equalityComparer);
        }
    }, {
        key: "_clearInternal",
        value: function _clearInternal() {
            var len = this._source.length;
            this._source.length = 0;
            return len;
        }
    }, {
        key: "_importEntries",
        value: function _importEntries(entries) {
            if (Types_1.Type.isArrayLike(entries)) {
                var len = entries.length;
                if (!len) return 0;
                var s = this._source;
                var first = s.length;
                s.length += len;
                for (var i = 0; i < len; i++) {
                    s[i + first] = entries[i];
                }
                return len;
            } else {
                return _get(Object.getPrototypeOf(List.prototype), "_importEntries", this).call(this, entries);
            }
        }
    }, {
        key: "get",
        value: function get(index) {
            return this._source[index];
        }
    }, {
        key: "set",
        value: function set(index, value) {
            var s = this._source;
            if (index < s.length && Compare_1.areEqual(value, s[index])) return false;
            s[index] = value;
            this._onModified();
            return true;
        }
    }, {
        key: "indexOf",
        value: function indexOf(item) {
            return Utility_1.indexOf(this._source, item, this._equalityComparer);
        }
    }, {
        key: "insert",
        value: function insert(index, value) {
            var s = this._source;
            if (index < s.length) {
                this._source.splice(index, 0, value);
            } else {
                this._source[index] = value;
            }
            this._onModified();
        }
    }, {
        key: "removeAt",
        value: function removeAt(index) {
            if (Utility_1.removeIndex(this._source, index)) {
                this._onModified();
                return true;
            }
            return false;
        }
    }, {
        key: "contains",
        value: function contains(item) {
            return Utility_1.contains(this._source, item, this._equalityComparer);
        }
    }, {
        key: "copyTo",
        value: function copyTo(target, index) {
            return Utility_1.copyTo(this._source, target, 0, index);
        }
    }, {
        key: "getEnumerator",
        value: function getEnumerator() {
            return new ArrayEnumerator_1.ArrayEnumerator(this._source);
        }
    }, {
        key: "forEach",
        value: function forEach(action, useCopy) {
            var s = this._source;
            return Enumerator_1.forEach(useCopy ? s.slice() : s, action);
        }
    }]);

    return List;
}(CollectionBase_1.CollectionBase);

exports.List = List;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = List;
//# sourceMappingURL=List.js.map
