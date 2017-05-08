/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Selector } from "../../FunctionTypes";
export declare function getIdentifier(obj: any): string | number | symbol;
export declare function getIdentifier(obj: any, throwIfUnknown: false): string | number | symbol;
export declare function getIdentifier(obj: any, throwIfUnknown: boolean): string | number | symbol | never;
export declare function getIdentifier(obj: any, unknownHandler: Selector<any, string | number | symbol>): string | number | symbol;
export default getIdentifier;
