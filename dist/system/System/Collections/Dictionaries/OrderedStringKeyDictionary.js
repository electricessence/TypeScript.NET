System.register(["../Array/Utility", "./StringKeyDictionary", "../../Exceptions/ArgumentOutOfRangeException", "../../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ArrayUtility, StringKeyDictionary_1, ArgumentOutOfRangeException_1, extends_1;
    var __extends, VOID0, OrderedStringKeyDictionary;
    return {
        setters:[
            function (ArrayUtility_1) {
                ArrayUtility = ArrayUtility_1;
            },
            function (StringKeyDictionary_1_1) {
                StringKeyDictionary_1 = StringKeyDictionary_1_1;
            },
            function (ArgumentOutOfRangeException_1_1) {
                ArgumentOutOfRangeException_1 = ArgumentOutOfRangeException_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            VOID0 = void 0;
            OrderedStringKeyDictionary = (function (_super) {
                __extends(OrderedStringKeyDictionary, _super);
                function OrderedStringKeyDictionary() {
                    _super.call(this);
                    this._order = [];
                }
                OrderedStringKeyDictionary.prototype.indexOfKey = function (key) {
                    var o = this._order;
                    return o.length ? o.indexOf(key, 0) : -1;
                };
                OrderedStringKeyDictionary.prototype.getValueByIndex = function (index) {
                    var o = this._order;
                    return index < o.length ? this.getValue(o[index]) : VOID0;
                };
                OrderedStringKeyDictionary.prototype.setValue = function (key, value, keepIndex) {
                    var _ = this;
                    var exists = _.indexOfKey(key) != -1;
                    if (!exists && (value !== VOID0 || keepIndex))
                        _._order.push(key);
                    else if (exists && value === VOID0 && !keepIndex)
                        ArrayUtility.remove(_._order, key);
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
                OrderedStringKeyDictionary.prototype.setValues = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i - 0] = arguments[_i];
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
            exports_1("default",OrderedStringKeyDictionary);
        }
    }
});
//# sourceMappingURL=OrderedStringKeyDictionary.js.map