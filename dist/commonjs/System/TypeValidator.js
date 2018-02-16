"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * A descriptor is simply a JSON tree that either has an actual value or a type that identifies what the expect type should be at that leaf in the tree.
 *
 * var descriptor = {
 *      a : Object,
 *      b : String,
 *      c : {
 *          d : true ,
 *          e : Array,
 *          f : []
 *      },
 *      g : "literal"
 * }
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("./Types");
var Compare_1 = require("./Compare");
var extends_1 = require("../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var TypeInfoHelper = /** @class */ (function (_super) {
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
        // Check array contents and confirm intersections.
        if (this.isArray && Types_1.Type.isArrayLike(descriptor)) {
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
            // Quick check...
            if (dKeys.length > targetKeys.length)
                return false;
            // Quick check #2...
            for (var _i = 0, dKeys_1 = dKeys; _i < dKeys_1.length; _i++) {
                var key = dKeys_1[_i];
                if (targetKeys.indexOf(key) == -1)
                    return false;
            }
            // Final pass with recursive...
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
exports.TypeInfoHelper = TypeInfoHelper;
function areInvalid(v, d) {
    if (!Compare_1.areEqual(v, d)) {
        var memberType = new TypeInfoHelper(v);
        if (!memberType.contains(d))
            return true;
    }
    return false;
}
var TypeValidator = /** @class */ (function () {
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
exports.TypeValidator = TypeValidator;
exports.default = TypeValidator;
//# sourceMappingURL=TypeValidator.js.map