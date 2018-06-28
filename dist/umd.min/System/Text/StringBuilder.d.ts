/*!
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/text/StringBuilder.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IDisposable } from "../Disposable/IDisposable";
export declare class StringBuilder implements IDisposable {
    private readonly _partArray;
    private _latest;
    constructor(...initial: any[]);
    private appendSingle;
    appendThese(items: any[]): StringBuilder;
    append(...items: any[]): StringBuilder;
    appendLine(...items: any[]): StringBuilder;
    appendLines(items: any[]): StringBuilder;
    /** /// These methods can only efficiently be added if not using a single array.
     insert(index: number, value: string, count: number = 1): StringBuilder
     {

    }

     remove(startIndex:number, length:number): StringBuilder
     {

    }
     /**/
    readonly isEmpty: boolean;
    toString(): string;
    join(delimiter: string): string;
    clear(): void;
    dispose(): void;
}
export default StringBuilder;
