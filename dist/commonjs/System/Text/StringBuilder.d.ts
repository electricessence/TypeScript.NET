import { IDisposable } from "../Disposable/IDisposable";
export declare class StringBuilder implements IDisposable {
    private _partArray;
    private _latest;
    constructor(...initial: any[]);
    private appendSingle(item);
    appendThese(items: any[]): StringBuilder;
    append(...items: any[]): StringBuilder;
    appendLine(...items: any[]): StringBuilder;
    appendLines(items: any[]): StringBuilder;
    readonly isEmpty: boolean;
    toString(): string | null;
    join(delimiter: string): string;
    clear(): void;
    dispose(): void;
}
export default StringBuilder;
