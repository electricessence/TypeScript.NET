/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Types', '../Collections/Dictionaries/OrderedStringKeyDictionary', './QueryParams'], function (require, exports, Types, OrderedStringKeyDictionary, QueryParams) {
    var ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
    var QueryBuilder = (function (_super) {
        __extends(QueryBuilder, _super);
        function QueryBuilder(query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            _super.call(this);
            if (Types.isString(query)) {
                this.importFromString(query, decodeValues);
            }
            else {
                this.importMap(query);
            }
        }
        QueryBuilder.prototype.importFromString = function (values, deserialize, decodeValues, preserveOrder) {
            var _this = this;
            if (deserialize === void 0) { deserialize = true; }
            if (decodeValues === void 0) { decodeValues = true; }
            if (preserveOrder === void 0) { preserveOrder = true; }
            QueryParams.parse(values, function (key, value) { _this.setValue(key, value, preserveOrder); }, deserialize, decodeValues);
            return this;
        };
        QueryBuilder.init = function (query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            return new QueryBuilder(query, decodeValues);
        };
        QueryBuilder.prototype.encode = function (prefixIfNotEmpty) {
            var entries = [];
            var keys = this.keys;
            for (var _i = 0; _i < keys.length; _i++) {
                var k = keys[_i];
                entries.push(k + KEY_VALUE_SEPARATOR
                    + QueryParams.encodeValue(this.getValue(k)));
            }
            return (entries.length && prefixIfNotEmpty ? '?' : '')
                + entries.join(ENTRY_SEPARATOR);
        };
        QueryBuilder.prototype.toString = function () {
            return this.encode();
        };
        return QueryBuilder;
    })(OrderedStringKeyDictionary);
    return QueryBuilder;
});
//# sourceMappingURL=QueryBuilder.js.map