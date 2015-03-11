///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Source Reference: http://referencesource.microsoft.com/#System.Xml.Linq/System/Xml/Linq/XLinq.cs,7dcfc7339b56ed0a
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{

	/// <summary>
	/// Represents a text node.
	/// </summary>

	export class XText extends XNode
	{
		private _value: string;

        /// <summary>
        /// Initializes a new instance of the XText class from another XText object.
        /// </summary>
        /// <param name="other">The text node to copy from.</param>
		constructor(text: XText);

        /// <summary>
        /// Initializes a new instance of the XText class.
        /// </summary>
        /// <param name="value">The string that contains the value of the text node.</param>
		constructor(text: string);

		constructor(text: any)
		{

			super();

			if (text instanceof XText)
				text = text.value;

			if (text != null && typeof (text) == System.Types.String)
				throw "Invalid Type: must be XText or string.";

			this._value = text;

		}

        /// <summary>
        /// Gets the value of this node.
        /// </summary>
		get value(): string
		{
			return this._value;
		}

		/// <summary>
        /// Sets the value of this node.
        /// </summary>
		set value(text: string)
		{
			if (text == null) throw 'new ArgumentNullException("value")';
			//bool notify = NotifyChanging(this, XObjectChangeEventArgs.Value);
			//text = value;
			//if (notify) NotifyChanged(this, XObjectChangeEventArgs.Value);

			this._value = text;
		}


        /// <summary>
        /// Gets the node type for this node.
        /// </summary>
        /// <remarks>
        /// This property will always return XmlNodeType.Text.
        /// </remarks>
		getNodeType(): XmlNodeType
		{
			return XmlNodeType.Text;
		}

        ///// <summary>
        ///// Write this <see cref="XText"/> to the given <see cref="XmlWriter"/>.
        ///// </summary>
        ///// <param name="writer">
        ///// The <see cref="XmlWriter"/> to write this <see cref="XText"/> to.
        ///// </param>
        //public override void WriteTo(XmlWriter writer) {
		//	if (writer == null) throw new ArgumentNullException("writer");
        //    if (parent is XDocument) {
		//		writer.WriteWhitespace(text);
        //    }
        //    else {
		//		writer.WriteString(text);
		//	}
		//}

        //internal override void AppendText(StringBuilder sb) {
		//	sb.Append(text);
		//}

        //internal override XNode CloneNode() {
		//	return new XText(this);
		//}

        //internal override bool DeepEquals(XNode node) {
        //    return node != null && NodeType == node.NodeType && text == ((XText)node).text;
		//}

        //internal override int GetDeepHashCode() {
		//	return text.GetHashCode();
		//}
	}
}

