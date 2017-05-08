/*!
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/text/StringBuilder.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IDisposable } from "../Disposable/IDisposable";
/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/string-concatenation-looped
 * http://jsperf.com/adding-strings-to-an-array
 * http://jsperf.com/string-concatenation-versus-array-operations-with-join
 *
 * It is clearly inefficient to use a StringBuilder or LinkedList to build a string when you have a small set of string portions.
 * StringBuilder will really show it's benefit likely somewhere above 1000 items.
 *****************************/
export declare class StringBuilder implements IDisposable {
    private _partArray;
    private _latest;
    constructor(...initial: any[]);
    private appendSingle(item);
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
    toString(): string | null;
    join(delimiter: string): string;
    clear(): void;
    dispose(): void;
}
export default StringBuilder;
