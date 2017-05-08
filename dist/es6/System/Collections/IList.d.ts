/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ICollection} from "./ICollection";
import {IReadOnlyCollection} from "./IReadOnlyCollection";

export interface IReadOnlyList<T> extends IReadOnlyCollection<T>
{
	get(index:number):T;
	indexOf(item:T):number;
}

export interface IList<T> extends ICollection<T>, IReadOnlyList<T>
{

	/* From ICollection<T>:
	 count: number;
	 isReadOnly: boolean;

	 add(item: T): void;
	 clear(): number;
	 contains(item: T): boolean;
	 copyTo(array: T[], index?: number): void;
	 remove(item: T): number;
	 */

	set(index:number, value:T):boolean;

	insert(index:number, value:T):void;

	removeAt(index:number):boolean;

}

export default IList;
