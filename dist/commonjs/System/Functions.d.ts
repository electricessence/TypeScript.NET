/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
/**
 * Can be used statically or extended for varying different reusable function signatures.
 */
export declare class Functions {
    /**
     * A typed method for use with simple selection of the parameter.
     * @returns {T}
     */
    Identity<T>(x: T): T;
    /**
     * Returns true.
     * @returns {boolean}
     */
    True(): boolean;
    /**
     * Returns false.
     * @returns {boolean}
     */
    False(): boolean;
    /**
     * Does nothing.
     */
    Blank(): void;
}
export declare module Functions {
    /**
     * A typed method for use with simple selection of the parameter.
     * @returns {boolean}
     */
    const Identity: <T>(x: T) => T;
    /**
     * Returns false.
     * @returns {boolean}
     */
    const True: () => boolean;
    /**
     * Returns false.
     * @returns {boolean}
     */
    const False: () => boolean;
    /**
     * Does nothing.
     */
    const Blank: () => void;
}
export default Functions;
