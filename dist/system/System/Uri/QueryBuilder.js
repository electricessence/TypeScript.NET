/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Types", "../Collections/Dictionaries/OrderedStringKeyDictionary", "../Collections/Enumeration/Enumerator", "./QueryParams", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var Types_1, OrderedStringKeyDictionary_1, Enumerator_1, QueryParams_1, extends_1, __extends, QueryBuilder;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (OrderedStringKeyDictionary_1_1) {
                OrderedStringKeyDictionary_1 = OrderedStringKeyDictionary_1_1;
            },
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            },
            function (QueryParams_1_1) {
                QueryParams_1 = QueryParams_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            /**
             * Provides a means for parsing and building a set of parameters.
             *
             * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
             */
            QueryBuilder = /** @class */ (function (_super) {
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
                /**
                 * Property parses the components of an URI into their values or array of values.
                 * @param values
                 * @param deserialize
                 * @param decodeValues
                 * @returns {QueryBuilder}
                 */
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
                /**
                 * Returns the encoded URI string
                 */
                QueryBuilder.prototype.encode = function (prefixIfNotEmpty) {
                    return QueryParams_1.encode(this, prefixIfNotEmpty);
                };
                QueryBuilder.prototype.toString = function () {
                    return this.encode();
                };
                return QueryBuilder;
            }(OrderedStringKeyDictionary_1.OrderedStringKeyDictionary));
            exports_1("QueryBuilder", QueryBuilder);
            exports_1("default", QueryBuilder);
        }
    };
});
//# sourceMappingURL=QueryBuilder.js.map