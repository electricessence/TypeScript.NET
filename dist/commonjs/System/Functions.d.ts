/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare class Functions {
    Identity<T>(x: T): T;
    True(): boolean;
    False(): boolean;
    Blank(): void;
}
export declare module Functions {
    const Identity: <T>(x: T) => T;
    const True: () => boolean;
    const False: () => boolean;
    const Blank: () => void;
}
export default Functions;
