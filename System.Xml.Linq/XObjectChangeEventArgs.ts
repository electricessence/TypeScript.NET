/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
module System.Xml.Linq
{

	export class XObjectChangeEventArgs extends System.EventArgs
	{

		/// <summary>
		/// Event argument for a <see cref="XObjectChange.Add"/> change event.
		/// </summary>

		static add: XObjectChangeEventArgs = new XObjectChangeEventArgs(XObjectChange.Add);

		/// <summary>
		/// Event argument for a <see cref="XObjectChange.Remove"/> change event.
		/// </summary>

		static remove: XObjectChangeEventArgs = new XObjectChangeEventArgs(XObjectChange.Remove);

		/// <summary>
		/// Event argument for a <see cref="XObjectChange.Name"/> change event.
		/// </summary>

		static name: XObjectChangeEventArgs = new XObjectChangeEventArgs(XObjectChange.Name);

		/// <summary>
		/// Event argument for a <see cref="XObjectChange.Value"/> change event.
		/// </summary>

		static value: XObjectChangeEventArgs = new XObjectChangeEventArgs(XObjectChange.Value);

		/// <summary>
		/// Initializes a new instance of the <see cref="XObjectChangeEventArgs"/> class.
		/// </summary>
		constructor(private _objectChange: XObjectChange)
		{
			super();
		}

		/// <summary>
		/// Gets the type (<see cref="XObjectChange"/>) of change.
		/// </summary>
		get objectChange(): XObjectChange
		{
			return this._objectChange;
		}
	}

	Object.freeze(XObjectChangeEventArgs);
}