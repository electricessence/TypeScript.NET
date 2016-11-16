import { IDisposable } from "./Disposable/IDisposable";
import { IMap } from "./Collections/Dictionaries/IDictionary";
export interface Error {
    name: string;
    message: string;
}
export declare class Exception implements Error, IDisposable {
    readonly name: string;
    readonly message: string;
    readonly stack: string;
    readonly data: IMap<any>;
    constructor(message: string, innerException?: Error, beforeSealing?: (ex: any) => void);
    protected getName(): string;
    toString(): string;
    protected toStringWithoutBrackets(): string;
    dispose(): void;
}
export default Exception;
