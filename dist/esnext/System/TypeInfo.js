/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var VOID0 = void (0);
// Only used for primitives.
var typeInfoRegistry = {};
/**
 * Exposes easy access to type information including inquiring about members.
 */
var TypeInfo = /** @class */ (function () {
    function TypeInfo(target, onBeforeFreeze) {
        this.isBoolean = false;
        this.isNumber = false;
        this.isFinite = false;
        this.isValidNumber = false;
        this.isString = false;
        this.isTrueNaN = false;
        this.isObject = false;
        this.isFunction = false;
        this.isUndefined = false;
        this.isNull = false;
        this.isPrimitive = false;
        this.isSymbol = false;
        this.isArray = false;
        this.isNullOrUndefined = false;
        switch (this.type = typeof target) {
            case "boolean" /* Boolean */:
                this.isBoolean = true;
                this.isPrimitive = true;
                break;
            case "number" /* Number */:
                this.isNumber = true;
                this.isTrueNaN = isNaN(target);
                this.isFinite = isFinite(target);
                this.isValidNumber = !this.isTrueNaN;
                this.isPrimitive = true;
                break;
            case "string" /* String */:
                this.isString = true;
                this.isPrimitive = true;
                break;
            case "symbol" /* Symbol */:
                this.isSymbol = true;
                break;
            case "object" /* Object */:
                this.target = target;
                if (target === null) {
                    this.isNull = true;
                    this.isNullOrUndefined = true;
                    this.isPrimitive = true;
                }
                else {
                    this.isArray = (target) instanceof (Array);
                    this.isObject = true;
                }
                break;
            case "function" /* Function */:
                this.target = target;
                this.isFunction = true;
                break;
            case "undefined" /* Undefined */:
                this.isUndefined = true;
                this.isNullOrUndefined = true;
                this.isPrimitive = true;
                break;
            default:
                throw "Fatal type failure.  Unknown type: " + this.type;
        }
        if (onBeforeFreeze)
            onBeforeFreeze(this);
        Object.freeze(this);
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
            : VOID0);
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
            case "object" /* Object */:
            case "function" /* Function */:
                return new TypeInfo(target);
        }
        var info = typeInfoRegistry[type];
        if (!info)
            typeInfoRegistry[type] = info = new TypeInfo(target);
        return info;
    };
    /**
     * Returns true if the target matches the type (instanceof).
     * @param type
     * @returns {boolean}
     */
    TypeInfo.prototype.is = function (type) {
        return this.target instanceof type;
    };
    /**
     * Returns null if the target does not match the type (instanceof).
     * Otherwise returns the target as the type.
     * @param type
     * @returns {T|null}
     */
    TypeInfo.prototype.as = function (type) {
        return this.target instanceof type ? this.target : null;
    };
    return TypeInfo;
}());
export default TypeInfo;
//# sourceMappingURL=TypeInfo.js.map