/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Collections {

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

		get(index: number): T;
		set(index: number, value: T);

		indexOf(item: T): number;
		insert(index: number, value: T);

		removeAt(index: number): void;

	}

} 