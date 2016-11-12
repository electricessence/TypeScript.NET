/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var VOID0 = void (0), _BOOLEAN = typeof true, _NUMBER = typeof 0, _STRING = typeof "", _SYMBOL = "symbol", _OBJECT = typeof {}, _UNDEFINED = typeof VOID0, _FUNCTION = typeof function () { }, LENGTH = "length";
    var typeInfoRegistry = {};
    var TypeInfo = (function () {
        function TypeInfo(target, onBeforeFreeze) {
            this.isBoolean = false;
            this.isNumber = false;
            this.isString = false;
            this.isTrueNaN = false;
            this.isObject = false;
            this.isFunction = false;
            this.isUndefined = false;
            this.isNull = false;
            this.isPrimitive = false;
            this.isSymbol = false;
            switch (this.type = typeof target) {
                case _BOOLEAN:
                    this.isBoolean = true;
                    this.isPrimitive = true;
                    break;
                case _NUMBER:
                    this.isNumber = true;
                    this.isTrueNaN = isNaN(target);
                    this.isFinite = isFinite(target);
                    this.isValidNumber = !this.isTrueNaN;
                    this.isPrimitive = true;
                    break;
                case _STRING:
                    this.isString = true;
                    this.isPrimitive = true;
                    break;
                case _SYMBOL:
                    this.isSymbol = true;
                    break;
                case _OBJECT:
                    this.target = target;
                    if (target === null) {
                        this.isNull = true;
                        this.isNullOrUndefined = true;
                        this.isPrimitive = true;
                    }
                    else {
                        this.isArray = Array.isArray(target);
                        this.isObject = true;
                    }
                    break;
                case _FUNCTION:
                    this.target = target;
                    this.isFunction = true;
                    break;
                case _UNDEFINED:
                    this.isUndefined = true;
                    this.isNullOrUndefined = true;
                    this.isPrimitive = true;
                    break;
                default:
                    throw "Fatal type failure.  Unknown type: " + this.type;
            }
            if (onBeforeFreeze)
                onBeforeFreeze();
            Object.freeze(this);
        }
        TypeInfo.prototype.member = function (name) {
            var t = this.target;
            return TypeInfo.getFor(t && (name) in (t)
                ? t[name]
                : VOID0);
        };
        TypeInfo.getFor = function (target) {
            var type = typeof target;
            switch (type) {
                case _OBJECT:
                case _FUNCTION:
                    return new TypeInfo(target);
            }
            var info = typeInfoRegistry[type];
            if (!info)
                typeInfoRegistry[type] = info = new TypeInfo(target);
            return info;
        };
        return TypeInfo;
    }());
    exports.TypeInfo = TypeInfo;
    var Type;
    (function (Type) {
        Type.BOOLEAN = _BOOLEAN;
        Type.NUMBER = _NUMBER;
        Type.STRING = _STRING;
        Type.OBJECT = _OBJECT;
        Type.SYMBOL = _SYMBOL;
        Type.UNDEFINED = _UNDEFINED;
        Type.FUNCTION = _FUNCTION;
        function isBoolean(value) {
            return typeof value === _BOOLEAN;
        }
        Type.isBoolean = isBoolean;
        function isNumber(value, allowNaN) {
            if (allowNaN === VOID0)
                allowNaN = true;
            return typeof value === _NUMBER && (allowNaN || !isNaN(value));
        }
        Type.isNumber = isNumber;
        function isTrueNaN(value) {
            return typeof value === _NUMBER && isNaN(value);
        }
        Type.isTrueNaN = isTrueNaN;
        function isString(value) {
            return typeof value === _STRING;
        }
        Type.isString = isString;
        function isPrimitive(value, allowUndefined) {
            if (allowUndefined === void 0) { allowUndefined = false; }
            var t = typeof value;
            switch (t) {
                case _BOOLEAN:
                case _STRING:
                case _NUMBER:
                    return true;
                case _UNDEFINED:
                    return allowUndefined;
                case _OBJECT:
                    return value === null;
            }
            return false;
        }
        Type.isPrimitive = isPrimitive;
        function isPrimitiveOrSymbol(value, allowUndefined) {
            if (allowUndefined === void 0) { allowUndefined = false; }
            return typeof value === _SYMBOL ? true : isPrimitive(value, allowUndefined);
        }
        Type.isPrimitiveOrSymbol = isPrimitiveOrSymbol;
        function isPropertyKey(value) {
            var t = typeof value;
            switch (t) {
                case _STRING:
                case _NUMBER:
                case _SYMBOL:
                    return true;
            }
            return false;
        }
        Type.isPropertyKey = isPropertyKey;
        function isFunction(value) {
            return typeof value === _FUNCTION;
        }
        Type.isFunction = isFunction;
        function isObject(value, allowNull) {
            if (allowNull === void 0) { allowNull = false; }
            return typeof value === _OBJECT && (allowNull || value !== null);
        }
        Type.isObject = isObject;
        function numberOrNaN(value) {
            return isNaN(value) ? NaN : value;
        }
        Type.numberOrNaN = numberOrNaN;
        function of(target) {
            return TypeInfo.getFor(target);
        }
        Type.of = of;
        function hasMember(instance, property) {
            return instance && !isPrimitive(instance) && (property) in (instance);
        }
        Type.hasMember = hasMember;
        function hasMemberOfType(instance, property, type) {
            return hasMember(instance, property) && typeof (instance[property]) === type;
        }
        Type.hasMemberOfType = hasMemberOfType;
        function hasMethod(instance, property) {
            return hasMemberOfType(instance, property, _FUNCTION);
        }
        Type.hasMethod = hasMethod;
        function isArrayLike(instance) {
            return instance instanceof Array
                || Type.isString(instance)
                || !Type.isFunction(instance) && hasMember(instance, LENGTH);
        }
        Type.isArrayLike = isArrayLike;
    })(Type = exports.Type || (exports.Type = {}));
    Object.freeze(Type);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Type;
});
//# sourceMappingURL=Types.js.map