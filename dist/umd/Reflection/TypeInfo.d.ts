/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
/**
 * Exposes easy access to type information including inquiring about members.
 */
export default class TypeInfo {
    protected readonly target: any;
    readonly type: string;
    readonly isBoolean: boolean;
    readonly isNumber: boolean;
    readonly isFinite: boolean;
    readonly isValidNumber: boolean;
    readonly isString: boolean;
    readonly isTrueNaN: boolean;
    readonly isObject: boolean;
    readonly isArray: boolean;
    readonly isFunction: boolean;
    readonly isUndefined: boolean;
    readonly isNull: boolean;
    readonly isNullOrUndefined: boolean;
    readonly isPrimitive: boolean;
    readonly isSymbol: boolean;
    constructor(target: any, onBeforeFreeze?: (instance: any) => void);
    /**
     * Returns a TypeInfo for any member or non-member,
     * where non-members are of type undefined.
     * @param name
     * @returns {TypeInfo}
     */
    member(name: string | number | symbol): TypeInfo;
    /**
     * Returns a TypeInfo for any target object.
     * If the target object is of a primitive type, it returns the TypeInfo instance assigned to that type.
     * @param target
     * @returns {TypeInfo}
     */
    static getFor(target: any): TypeInfo;
    /**
     * Returns true if the target matches the type (instanceof).
     * @param type
     * @returns {boolean}
     */
    is<T>(type: {
        new (...params: any[]): T;
    }): boolean;
    /**
     * Returns null if the target does not match the type (instanceof).
     * Otherwise returns the target as the type.
     * @param type
     * @returns {T|null}
     */
    as<T>(type: {
        new (...params: any[]): T;
    }): T | null;
}
