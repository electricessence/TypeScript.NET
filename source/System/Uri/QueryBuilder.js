(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "../Types", "../Collections/Dictionaries/OrderedStringKeyDictionary", "../Collections/Enumeration/Enumerator", "./QueryParams", "../../extends"], function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var OrderedStringKeyDictionary_1 = require("../Collections/Dictionaries/OrderedStringKeyDictionary");
    var Enumerator_1 = require("../Collections/Enumeration/Enumerator");
    var QueryParams_1 = require("./QueryParams");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var QueryBuilder = (function (_super) {
        __extends(QueryBuilder, _super);
        function QueryBuilder(query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            var _this = _super.call(this) || this;
            _this.importQuery(query, decodeValues);
            return _this;
        }
        QueryBuilder.init = function (query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            return new QueryBuilder(query, decodeValues);
        };
        QueryBuilder.prototype.importQuery = function (query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            if (Types_1.Type.isString(query)) {
                this.importFromString(query, decodeValues);
            }
            else if (Enumerator_1.isEnumerableOrArrayLike(query)) {
                this.importEntries(query);
            }
            else {
                this.importMap(query);
            }
            return this;
        };
        QueryBuilder.prototype.importFromString = function (values, deserialize, decodeValues) {
            if (deserialize === void 0) { deserialize = true; }
            if (decodeValues === void 0) { decodeValues = true; }
            var _ = this;
            QueryParams_1.parse(values, function (key, value) {
                if (_.containsKey(key)) {
                    var prev = _.getValue(key);
                    if ((prev) instanceof (Array))
                        prev.push(value);
                    else
                        _.setValue(key, [prev, value]);
                }
                else
                    _.setValue(key, value);
            }, deserialize, decodeValues);
            return this;
        };
        QueryBuilder.prototype.encode = function (prefixIfNotEmpty) {
            return QueryParams_1.encode(this, prefixIfNotEmpty);
        };
        QueryBuilder.prototype.toString = function () {
            return this.encode();
        };
        return QueryBuilder;
    }(OrderedStringKeyDictionary_1.OrderedStringKeyDictionary));
    exports.QueryBuilder = QueryBuilder;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = QueryBuilder;
});
//# sourceMappingURL=QueryBuilder.js.map