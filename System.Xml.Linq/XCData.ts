///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	/// <summary>
    /// Represents a text node that contains CDATA.
	/// </summary
	export class XCData extends XText
	{
        /// <summary>
        /// Initializes a new instance of the XCData class.
        /// </summary>
        /// <param name="value">The string that contains the value of the XCData node.</param>
		constructor(other: XCData);

        /// <summary>
        /// Initializes a new instance of the XCData class.
        /// </summary>
        /// <param name="other">Text node to copy from</param>
		constructor(value: string);

		constructor(cdata: any)
		{
			super(cdata);
		}

        /// <summary>
        /// Gets the node type for this node.
        /// </summary>
        /// <remarks>
        /// This property will always return XmlNodeType.CDATA.
        /// </remarks>
		getNodeType(): XmlNodeType
		{
			return XmlNodeType.CDATA;
		}

        ///// <summary>
        ///// Write this <see cref="XCData"/> to the given <see cref="XmlWriter"/>.
        ///// </summary>
        ///// <param name="writer">
        ///// The <see cref="XmlWriter"/> to write this <see cref="XCData"/> to.
        ///// </param>
        //public override void WriteTo(XmlWriter writer) {
		//	if (writer == null) throw new ArgumentNullException("writer");
		//	writer.WriteCData(text);
		//}
 
        //internal override XNode CloneNode() {
		//	return new XCData(this);
		//}
    }
}