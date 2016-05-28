/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {IDisposable} from "../../Disposable/IDisposable";
import {IIterator} from "./IIterator";

// IIterator is added for future compatibility.
export interface IEnumerator<T> extends IIterator<T>, IDisposable
{

	/**
	 * The current value within the enumeration.
	 */
	current: T;

	/**
	 * Safely moves to the next entry and returns true if there is one.
	 */
	moveNext(value?:any): boolean;

	/**
	 * Restarts the enumeration.
	 */
	reset(): void;

	/**
	 * Calls .moveNext() and returns .current
	 */
	nextValue(value?:any):T;

	/**
	 * Provides a way of flagging endless enumerations that may cause issues.
	 */
	isEndless?:boolean;
}




export default IEnumerator;