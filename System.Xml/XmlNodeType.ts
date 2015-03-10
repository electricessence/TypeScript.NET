/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.xmlnodetype%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml
{
	export enum XmlNodeType {
		/*
		 An attribute (for example, id='123' ).
		 An Attribute node can have the following child node types: Text and EntityReference. The Attribute node does not appear as the child node of any other node type. It is not considered a child node of an Element.
		 */
		Attribute,

		/*
		 A CDATA section (for example, <![CDATA[my escaped text]]> ).
		 CDATA sections are used to escape blocks of text that would otherwise be recognized as markup. A CDATA node cannot have any child nodes. It can appear as the child of the DocumentFragment, EntityReference, and Element nodes.
		 */
		CDATA,

		/*
		 A comment (for example, <!-- my comment --> ).
		 A Comment node cannot have any child nodes. It can appear as the child of the Document, DocumentFragment, Element, and EntityReference nodes.
		 */
		Comment,

		/*
		 * A document object that, as the root of the document tree, provides access to the entire XML document.
		 A Document node can have the following child node types: XmlDeclaration, Element (maximum of one), ProcessingInstruction, Comment, and DocumentType. It cannot appear as the child of any node types.
		 */
		Document,

		/*
		 A document fragment.
		 The DocumentFragment node associates a node or subtree with a document without actually being contained within the document. A DocumentFragment node can have the following child node types: Element, ProcessingInstruction, Comment, Text, CDATA, and EntityReference. It cannot appear as the child of any node types.
		 */
		DocumentFragment,

		/*
		 The document type declaration, indicated by the following tag (for example, <!DOCTYPE...> ).
		 A DocumentType node can have the following child node types: Notation and Entity. It can appear as the child of the Document node.
		 */
		DocumentType,

		/*
		 An element (for example, <item> ).
		 An Element node can have the following child node types: Element, Text, Comment, ProcessingInstruction, CDATA, and EntityReference. It can be the child of the Document, DocumentFragment, EntityReference, and Element nodes.
		 */
		Element,

		/*
		 An end element tag (for example, </item> ).
		 EndElement nodes are returned when XmlReader gets to the end of an element.
		 */
		EndElement,

		/*
		 Returned when XmlReader gets to the end of the entity replacement as a result of a call to ResolveEntity.
		 */
		EndEntity,

		/*
		 An entity declaration (for example, <!ENTITY...> ).
		 An Entity node can have child nodes that represent the expanded entity (for example, Text and EntityReference nodes). It can appear as the child of the DocumentType node.
		 */
		Entity,

		/*
		 A reference to an entity (for example, &num; )
		 An EntityReference node can have the following child node types: Element, ProcessingInstruction, Comment, Text, CDATA, and EntityReference. It can appear as the child of the Attribute, DocumentFragment, Element, and EntityReference nodes.
		 */
		EntityReference,

		/*
		 This is returned by the XmlReader if a Read method has not been called.
		 */
		None,

		/*
		 A notation in the document type declaration (for example, <!NOTATION...> ).
		 A Notation node cannot have any child nodes. It can appear as the child of the DocumentType node.
		 */
		Notation,

		/*
		 A processing instruction (for example, <?pi test?> ).
		 A ProcessingInstruction node cannot have any child nodes. It can appear as the child of the Document, DocumentFragment, Element, and EntityReference nodes.
		 */
		ProcessingInstruction,


		/*
		 White space between markup in a mixed content model or white space within the xml:space="preserve" scope.
		 */
		SignificantWhitespace,

		/*
		 The text content of a node.
		 A Text node cannot have any child nodes. It can appear as the child node of the Attribute, DocumentFragment, Element, and EntityReference nodes.
		 */
		Text,

		/*
		 White space between markup.
		 */
		Whitespace,

		/*
		 The XML declaration (for example, <?xml version='1.0'?> ).
		 The XmlDeclaration node must be the first node in the document. It cannot have children. It is a child of the Document node. It can have attributes that provide version and encoding information.
		 */
		XmlDeclaration
	}

	Object.freeze(XmlNodeType);
}