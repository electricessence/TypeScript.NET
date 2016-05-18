/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ICollection} from "./ICollection";

export interface IList<T> extends ICollection<T>
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

	get(index:number): T;
	set(index:number, value:T):boolean;

	indexOf(item:T): number;
	insert(index:number, value:T):void;

	removeAt(index:number): boolean;

}

export default IList;
