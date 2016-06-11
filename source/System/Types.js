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
    var VOID0 = void (0), _BOOLEAN = typeof true, _NUMBER = typeof 0, _STRING = typeof "", _OBJECT = typeof {}, _UNDEFINED = typeof VOID0, _FUNCTION = typeof function () { }, LENGTH = "length";
    var typeInfoRegistry = {};
    var TypeInfo = (function () {
        function TypeInfo(target, onBeforeFreeze) {
            var _ = this;
            _.isBoolean = false;
            _.isNumber = false;
            _.isString = false;
            _.isTrueNaN = false;
            _.isObject = false;
            _.isFunction = false;
            _.isUndefined = false;
            _.isNull = false;
            _.isPrimitive = false;
            switch (_.type = typeof target) {
                case _BOOLEAN:
                    _.isBoolean = true;
                    _.isPrimitive = true;
                    break;
                case _NUMBER:
                    _.isNumber = true;
                    _.isTrueNaN = isNaN(target);
                    _.isFinite = isFinite(target);
                    _.isValidNumber = !_.isTrueNaN;
                    _.isPrimitive = true;
                    break;
                case _STRING:
                    _.isString = true;
                    _.isPrimitive = true;
                    break;
                case _OBJECT:
                    _.target = target;
                    if (target === null) {
                        _.isNull = true;
                        _.isNullOrUndefined = true;
                        _.isPrimitive = true;
                    }
                    else {
                        _.isArray = Array.isArray(target);
                        _.isObject = true;
                    }
                    break;
                case _FUNCTION:
                    _.target = target;
                    _.isFunction = true;
                    break;
                case _UNDEFINED:
                    _.isUndefined = true;
                    _.isNullOrUndefined = true;
                    _.isPrimitive = true;
                    break;
                default:
                    throw "Fatal type failure.  Unknown type: " + _.type;
            }
            if (onBeforeFreeze)
                onBeforeFreeze();
            Object.freeze(_);
        }
        TypeInfo.prototype.member = function (name) {
            var t = this.target;
            return TypeInfo.getFor(t && (name) in (t)
                ? t[name]
                : undefined);
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
        function isPrimitive(value) {
            var t = typeof value;
            switch (t) {
                case _BOOLEAN:
                case _STRING:
                case _NUMBER:
                case _UNDEFINED:
                    return true;
                case _OBJECT:
                    return value === null;
            }
            return false;
        }
        Type.isPrimitive = isPrimitive;
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
        function hasMember(value, property) {
            return value && !isPrimitive(value) && (property) in (value);
        }
        Type.hasMember = hasMember;
        function hasMemberOfType(instance, property, type) {
            return hasMember(instance, property) && typeof (instance[property]) === type;
        }
        Type.hasMemberOfType = hasMemberOfType;
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