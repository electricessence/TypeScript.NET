System.register(["./StringKeyDictionary", "../../Exceptions/ArgumentOutOfRangeException", "../Array/Utility", "../../../extends", "../../Integer"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var StringKeyDictionary_1, ArgumentOutOfRangeException_1, Utility_1, extends_1, Integer_1, __extends, VOID0, OrderedStringKeyDictionary;
    return {
        setters: [
            function (StringKeyDictionary_1_1) {
                StringKeyDictionary_1 = StringKeyDictionary_1_1;
            },
            function (ArgumentOutOfRangeException_1_1) {
                ArgumentOutOfRangeException_1 = ArgumentOutOfRangeException_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            },
            function (Integer_1_1) {
                Integer_1 = Integer_1_1;
            }
        ],
        execute: function () {
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            VOID0 = void 0;
            OrderedStringKeyDictionary = (function (_super) {
                __extends(OrderedStringKeyDictionary, _super);
                function OrderedStringKeyDictionary() {
                    var _this = _super.call(this) || this;
                    // noinspection JSMismatchedCollectionQueryUpdate
                    _this._order = []; // Maintains indexes.
                    return _this;
                }
                OrderedStringKeyDictionary.prototype.indexOfKey = function (key) {
                    var o = this._order;
                    return o.length ? o.indexOf(key, 0) : -1;
                };
                OrderedStringKeyDictionary.prototype.getValueByIndex = function (index) {
                    Integer_1.Integer.assertZeroOrGreater(index);
                    var o = this._order;
                    if (index < o.length)
                        return this.getAssuredValue(o[index]);
                    throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('index', index);
                };
                // adding keepIndex allows for clearing a value while still retaining it's index.
                OrderedStringKeyDictionary.prototype.setValue = function (key, value, keepIndex) {
                    // TODO: This may be inefficient and could be improved.
                    var _ = this;
                    var exists = _.indexOfKey(key) != -1;
                    if (!exists && (value !== VOID0 || keepIndex))
                        _._order.push(key);
                    else if (exists && value === VOID0 && !keepIndex)
                        Utility_1.remove(_._order, key);
                    return _super.prototype.setValue.call(this, key, value);
                };
                OrderedStringKeyDictionary.prototype.setByIndex = function (index, value) {
                    var _ = this;
                    var order = _._order;
                    if (index < 0)
                        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('index', index, 'Is less than zero.');
                    if (index >= order.length)
                        throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('index', index, 'Is greater than the count.');
                    return _.setValue(order[index], value);
                };
                // importValues([x,y,z]);
                OrderedStringKeyDictionary.prototype.importValues = function (values) {
                    var _ = this;
                    return _.handleUpdate(function () {
                        var changed = false;
                        for (var i = 0; i < values.length; i++) {
                            if (_.setByIndex(i, values[i]))
                                changed = true;
                        }
                        return changed;
                    });
                };
                // setValues(x,y,z);
                OrderedStringKeyDictionary.prototype.setValues = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i] = arguments[_i];
                    }
                    return this.importValues(values);
                };
                OrderedStringKeyDictionary.prototype.removeByIndex = function (index) {
                    return this.setByIndex(index, VOID0);
                };
                OrderedStringKeyDictionary.prototype.getKeys = function () {
                    var _ = this;
                    var o = _._order;
                    return o.length && o.filter(function (key) { return _.containsKey(key); }) || [];
                };
                return OrderedStringKeyDictionary;
            }(StringKeyDictionary_1.StringKeyDictionary));
            exports_1("OrderedStringKeyDictionary", OrderedStringKeyDictionary);
            exports_1("default", OrderedStringKeyDictionary);
        }
    };
});
//# sourceMappingURL=OrderedStringKeyDictionary.js.map