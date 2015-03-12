/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	export enum XObjectChange {
		/// <summary>
		/// An <see cref="XObject"/> has been or will be added to an <see cref="XContainer"/>.
		/// </summary>
		Add,

		/// <summary>
		/// An <see cref="XObject"/> has been or will be removed from an <see cref="XContainer"/>.
		/// </summary>
		Remove,

		/// <summary>
		/// An <see cref="XObject"/> has been or will be renamed.
		/// </summary>
		Name,

		/// <summary>
		/// The value of an <see cref="XObject"/> has been or will be changed.
		/// There is a special case for elements. Change in the serialization
		/// of an empty element (either from an empty tag to start/end tag
		/// pair or vice versa) raises this event.
		/// </summary>
		Value,
	}

	Object.freeze(XObjectChange);
}