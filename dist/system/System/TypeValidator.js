/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
System.register(["./Types", "./Compare", "../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function areInvalid(v, d) {
        if (!Compare_1.areEqual(v, d)) {
            var memberType = new TypeInfoHelper(v);
            if (!memberType.contains(d))
                return true;
        }
        return false;
    }
    var Types_1, Compare_1, extends_1, __extends, TypeInfoHelper, TypeValidator;
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT
             */
            __extends = extends_1.default;
            TypeInfoHelper = (function (_super) {
                __extends(TypeInfoHelper, _super);
                function TypeInfoHelper(value) {
                    return _super.call(this, value, function (self) { return self._value = value; }) || this;
                }
                TypeInfoHelper.prototype.contains = function (descriptor) {
                    var value = this._value;
                    if (value === descriptor)
                        return true;
                    switch (descriptor) {
                        case Function:
                            return this.isFunction;
                        case Object:
                            return this.isObject;
                        case Array:
                            return this.isArray;
                        case String:
                            return this.isString;
                        case Number:
                            return this.isNumber;
                        case Boolean:
                            return this.isBoolean;
                    }
                    if (this.type != typeof descriptor || this.isPrimitive && !Compare_1.areEqual(value, descriptor))
                        return false;
                    if (this.isArray && Array.isArray(descriptor)) {
                        var max = Math.min(descriptor.length, value.length);
                        for (var i = 0; i < max; i++) {
                            if (areInvalid(value[i], descriptor[i]))
                                return false;
                        }
                        return true;
                    }
                    if (this.isObject) {
                        var targetKeys = Object.keys(value);
                        var dKeys = Object.keys(descriptor);
                        if (dKeys.length > targetKeys.length)
                            return false;
                        for (var _i = 0, dKeys_1 = dKeys; _i < dKeys_1.length; _i++) {
                            var key = dKeys_1[_i];
                            if (targetKeys.indexOf(key) == -1)
                                return false;
                        }
                        for (var _a = 0, dKeys_2 = dKeys; _a < dKeys_2.length; _a++) {
                            var key = dKeys_2[_a];
                            if (areInvalid(value[key], descriptor[key]))
                                return false;
                        }
                    }
                    return true;
                };
                return TypeInfoHelper;
            }(Types_1.TypeInfo));
            exports_1("TypeInfoHelper", TypeInfoHelper);
            TypeValidator = (function () {
                function TypeValidator(_typeDescriptor) {
                    this._typeDescriptor = _typeDescriptor;
                    Object.freeze(this);
                }
                TypeValidator.prototype.isSubsetOf = function (o) {
                    return (new TypeInfoHelper(o))
                        .contains(this._typeDescriptor);
                };
                return TypeValidator;
            }());
            exports_1("TypeValidator", TypeValidator);
            exports_1("default", TypeValidator);
        }
    };
});
//# sourceMappingURL=TypeValidator.js.map