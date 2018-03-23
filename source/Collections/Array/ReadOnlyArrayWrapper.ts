/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import ReadOnlyCollectionWrapper from "../ReadOnlyCollectionWrapper";

export default class ReadOnlyArrayWrapper<T> extends ReadOnlyCollectionWrapper<T>
{

	constructor(array:ArrayLike<T>)
	{
		super(array);
		this.__getValueAt = i => array[i];
	}

	protected _onDispose()
	{
		super._onDispose();
		this.__getValueAt = <any>null;
	}

	private __getValueAt:(i:number)=>T;
	getValueAt(index:number):T {
		this.throwIfDisposed();
		return this.__getValueAt(index);
	}
}
