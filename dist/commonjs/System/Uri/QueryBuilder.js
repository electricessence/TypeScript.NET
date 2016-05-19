/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Types_1 = require("../Types");
var OrderedStringKeyDictionary_1 = require("../Collections/Dictionaries/OrderedStringKeyDictionary");
var Enumerator_1 = require("../Collections/Enumeration/Enumerator");
var QueryParams = require("./QueryParams");

var QueryBuilder = function (_OrderedStringKeyDict) {
    _inherits(QueryBuilder, _OrderedStringKeyDict);

    function QueryBuilder(query) {
        var decodeValues = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        _classCallCheck(this, QueryBuilder);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(QueryBuilder).call(this));

        _this.importQuery(query, decodeValues);
        return _this;
    }

    _createClass(QueryBuilder, [{
        key: "importQuery",
        value: function importQuery(query) {
            var decodeValues = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            if (Types_1.Type.isString(query)) {
                this.importFromString(query, decodeValues);
            } else if (Enumerator_1.isEnumerableOrArrayLike(query)) {
                this.importEntries(query);
            } else {
                this.importMap(query);
            }
            return this;
        }
    }, {
        key: "importFromString",
        value: function importFromString(values) {
            var deserialize = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
            var decodeValues = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            var _ = this;
            QueryParams.parse(values, function (key, value) {
                if (_.containsKey(key)) {
                    var prev = _.getValue(key);
                    if (Array.isArray(prev)) prev.push(value);else _.setValue(key, [prev, value]);
                } else _.setValue(key, value);
            }, deserialize, decodeValues);
            return this;
        }
    }, {
        key: "encode",
        value: function encode(prefixIfNotEmpty) {
            return QueryParams.encode(this, prefixIfNotEmpty);
        }
    }, {
        key: "toString",
        value: function toString() {
            return this.encode();
        }
    }], [{
        key: "init",
        value: function init(query) {
            var decodeValues = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            return new QueryBuilder(query, decodeValues);
        }
    }]);

    return QueryBuilder;
}(OrderedStringKeyDictionary_1.OrderedStringKeyDictionary);

exports.QueryBuilder = QueryBuilder;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map
