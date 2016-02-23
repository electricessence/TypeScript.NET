(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    /*
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
    ///<reference path="Primitive.d.ts"/>
    ///<reference path="Collections/Array/IArray.d.ts"/>
    'use strict'; // For compatibility with (let, const, function, class);
    var VOID0 = void (0), _BOOLEAN = typeof true, _NUMBER = typeof 0, _STRING = typeof "", _OBJECT = typeof {}, _UNDEFINED = typeof VOID0, _FUNCTION = typeof function () { };
    // Only used for primitives.
    var typeInfoRegistry = {};
    /**
     * Exposes easy access to type information including inquiring about members.
     */
    var TypeInfo = (function () {
        function TypeInfo(target) {
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
                        _.isObject = true;
                    }
                    break;
                case _FUNCTION:
                    _.target = target;
                    _.isString = true;
                    break;
                case _UNDEFINED:
                    _.isUndefined = true;
                    _.isNullOrUndefined = true;
                    _.isPrimitive = true;
                    break;
                default:
                    throw "Fatal type failure.  Unknown type: " + _.type;
            }
            Object.freeze(_);
        }
        /**
         * Returns a TypeInfo for any member or non-member,
         * where non-members are of type undefined.
         * @param name
         * @returns {TypeInfo}
         */
        TypeInfo.prototype.member = function (name) {
            var t = this.target;
            return TypeInfo.getFor(t && (name) in (t)
                ? t[name]
                : undefined);
        };
        /**
         * Returns a TypeInfo for any target object.
         * If the target object is of a primitive type, it returns the TypeInfo instance assigned to that type.
         * @param target
         * @returns {TypeInfo}
         */
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
        /**
         * typeof true
         * @type {string}
         */
        Type.BOOLEAN = _BOOLEAN;
        /**
         * typeof 0
         * @type {string}
         */
        Type.NUMBER = _NUMBER;
        /**
         * typeof ""
         * @type {string}
         */
        Type.STRING = _STRING;
        /**
         * typeof {}
         * @type {string}
         */
        Type.OBJECT = _OBJECT;
        /**
         * typeof undefined
         * @type {string}
         */
        Type.UNDEFINED = _UNDEFINED;
        /**
         * typeof function
         * @type {string}
         */
        Type.FUNCTION = _FUNCTION;
        /**
         * Returns true if the value parameter is a boolean.
         * @param value
         * @returns {boolean}
         */
        function isBoolean(value) {
            return typeof value === _BOOLEAN;
        }
        Type.isBoolean = isBoolean;
        /**
         * Returns true if the value parameter is a number.
         * @param value
         * @param allowNaN Default is true.
         * @returns {boolean}
         */
        function isNumber(value, allowNaN) {
            if (allowNaN === VOID0)
                allowNaN = true;
            return typeof value === _NUMBER && (allowNaN || !isNaN(value));
        }
        Type.isNumber = isNumber;
        /**
         * Returns true if is a number and is NaN.
         * @param value
         * @returns {boolean}
         */
        function isTrueNaN(value) {
            return typeof value === _NUMBER && isNaN(value);
        }
        Type.isTrueNaN = isTrueNaN;
        /**
         * Returns true if the value parameter is a string.
         * @param value
         * @returns {boolean}
         */
        function isString(value) {
            return typeof value === _STRING;
        }
        Type.isString = isString;
        /**
         * Returns true if the value is a boolean, string, number, null, or undefined.
         * @param value
         * @returns {boolean}
         */
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
        /**
         * Returns true if the value parameter is a function.
         * @param value
         * @returns {boolean}
         */
        function isFunction(value) {
            return typeof value === _FUNCTION;
        }
        Type.isFunction = isFunction;
        /**
         * Returns true if the value parameter is an object.
         * @param value
         * @returns {boolean}
         */
        function isObject(value) {
            return typeof value === _OBJECT;
        }
        Type.isObject = isObject;
        /**
         * Guarantees a number value or NaN instead.
         * @param value
         * @returns {number}
         */
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
            return instance instanceof Array || hasMember(instance, "length");
        }
        Type.isArrayLike = isArrayLike;
    })(Type || (Type = {}));
    Object.freeze(Type);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Type;
});
//# sourceMappingURL=Types.js.map