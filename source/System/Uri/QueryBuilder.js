/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../Types', './QueryParams', '../Collections/Dictionaries/OrderedStringKeyDictionary'], function (require, exports) {
    ///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
    ///<reference path="../Serialization/ISerializable.d.ts"/>
    ///<reference path="IUriComponentFormattable.d.ts"/>
    ///<reference path="../Primitive.d.ts"/>
    var Types_1 = require('../Types');
    var QueryParams = require('./QueryParams');
    var OrderedStringKeyDictionary_1 = require('../Collections/Dictionaries/OrderedStringKeyDictionary');
    var ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
    var QueryBuilder = (function (_super) {
        __extends(QueryBuilder, _super);
        function QueryBuilder(query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            _super.call(this);
            if (Types_1.default.isString(query)) {
                this.importFromString(query, decodeValues);
            }
            else {
                this.importMap(query);
            }
        }
        QueryBuilder.prototype.importFromString = function (values, deserialize, decodeValues) {
            if (deserialize === void 0) { deserialize = true; }
            if (decodeValues === void 0) { decodeValues = true; }
            var _ = this;
            QueryParams.parse(values, function (key, value) {
                if (_.containsKey(key)) {
                    var prev = _.getValue(key);
                    if (prev instanceof Array)
                        prev.push(value);
                    else
                        _.setValue(key, [prev, value]);
                }
                else
                    _.setValue(key, value);
            }, deserialize, decodeValues);
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
                var value = this.getValue(k);
                for (var _a = 0, _b = value instanceof Array ? value : [value]; _a < _b.length; _a++) {
                    var v = _b[_a];
                    entries.push(k + KEY_VALUE_SEPARATOR
                        + QueryParams.encodeValue(v));
                }
            }
            return (entries.length && prefixIfNotEmpty ? '?' : '')
                + entries.join(ENTRY_SEPARATOR);
        };
        QueryBuilder.prototype.toString = function () {
            return this.encode();
        };
        return QueryBuilder;
    })(OrderedStringKeyDictionary_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = QueryBuilder;
});
//# sourceMappingURL=QueryBuilder.js.map