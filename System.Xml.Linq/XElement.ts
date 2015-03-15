///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{

	import IEnumerable = System.Collections.IEnumerable;
	import Enumerable = System.Linq.Enumerable;

	var empty: Enumerable<XElement>;

	export class XElement extends XContainer {
		constructor() {
			super();
		}

		private _name:XName;
		get name():XName { return this._name; }
		set name(value:XName) { this._name = value; }

		/// <summary>
		/// Gets an empty collection of elements.
		/// </summary>
		static get emptySequence():Enumerable<XElement> {
			return empty || (empty = Enumerable.empty<XElement>());
		}

		/*internal*/
		_lastAttr: XAttribute;

		/// <summary>
		/// Initializes a new instance of the XElement class with the specified name.
		/// </summary>
		/// <param name="name">
		/// The name of the element.
		/// </param>
		public XElement(name:XName)
	{
		if (name == null) throw 'ArgumentNullException("name")';
		this.name = name;
	}

		/// <summary>
		/// Initializes a new instance of the XElement class with the specified name and content.
		/// </summary>
		/// <param name="name">
		/// The element name.
		/// </param>
		/// <param name="content">The initial contents of the element.</param>
		/// <remarks>
		/// See XContainer.Add(content:any) for details about the content that can be added
		/// using this method.
		/// </remarks>
		public XElement(name:XName, content:any)
			: this(name)
	{
		AddContentSkipNotify(content);
	}

		/// <summary>
		/// Initializes a new instance of the XElement class with the specified name and content.
		/// </summary>
		/// <param name="name">
		/// The element name.
		/// </param>
		/// <param name="content">
		/// The initial content of the element.
		/// </param>
		/// <remarks>
		/// See XContainer.Add(content:any) for details about the content that can be added
		/// using this method.
		/// </remarks>
		public XElement(name:XName, ..._content:any[]) : this(name, <any>content) { }

		/// <summary>
		/// Initializes a new instance of the XElement class from another XElement object.
		/// </summary>
		/// <param name="other">
		/// Another element that will be copied to this element.
		/// </param>
		/// <remarks>
		/// This constructor makes a deep copy from one element to another.
		/// </remarks>
		public XElement(other:XElement)
			: base(other)
	{
		this.name = other.name;
		var a: XAttribute = other.lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				AppendAttributeSkipNotify(new XAttribute(a));
			} while (a != other.lastAttr);
		}
	}

		/// <summary>
		/// Initializes an XElement object from an <see cref="XStreamingElement"/> object.
		/// </summary>
		/// <param name="other">
		/// The <see cref="XStreamingElement"/> object whose value will be used
		/// to initialise the new element.
		/// </param>
		public XElement(other:XStreamingElement)
	{
		if (other == null) throw 'ArgumentNullException("other")';
		name = other.name;
		AddContentSkipNotify(other._content);
	}

	/*internal*/ XElement()
			: this("default")
	{
	}

	/*internal*/ XElement(r:XmlReader)
			: this(r, LoadOptions.None)
	{
	}

	/*internal*/ XElement(r:XmlReader, o:LoadOptions)
	{
		ReadElementFrom(r, o);
	}

	/// <summary>
	/// Gets the first attribute of an element.
	/// </summary>
	get FirstAttribute():XAttribute
	{
		return lastAttr != null ? lastAttr.next : null;
	}

	/// <summary>
	/// Gets a value indicating whether the element as at least one attribute.
	/// </summary>
	get HasAttributes():boolean
	{
		return lastAttr != null;
	}

		/// <summary>
		/// Gets a value indicating whether the element has at least one child element.
		/// </summary>
		public boolean HasElements
	{
		get
		{
			var n: XNode = content as XNode;
			if (n != null)
			{
				do
				{
					if (n instanceof XElement) return true;
					n = n.next;
				} while (n != content);
			}
			return false;
		}
	}

	/// <summary>
	/// Gets a value indicating whether the element contains no content.
	/// </summary>
	get IsEmpty():boolean
	{
		return content == null;
	}

	/// <summary>
	/// Gets the last attribute of an element.
	/// </summary>
	get LastAttribute():XAttribute
	{
		return lastAttr;
	}

		/// <summary>
		/// Gets the name of this element.
		/// </summary>
		public XName Name
	{
		get
		{
			return name;
		}
		set
		{
			if (value == null) throw 'ArgumentNullException("value")';
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Name);
			name = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Name);
		}
	}

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.Text.
		/// </remarks>
		public XmlNodeType NodeType
	{
		get
		{
			return XmlNodeType.Element;
		}
	}

		/// <summary>
		/// Gets the text contents of this element.
		/// </summary>
		/// <remarks>
		/// If there is text content interspersed with nodes (content:mixed) then the text content
		/// will be concatenated and returned.
		/// </remarks>
		public string Value
	{
		get
		{
			if (content == null) return string.Empty;
			var s: string = content as string;
			if (s != null) return s;
			var sb: StringBuilder = new StringBuilder();
			AppendText(sb);
			return sb.ToString();
		}
		set
		{
			if (value == null) throw 'ArgumentNullException("value")';
			RemoveNodes();
			Add(value);
		}
	}

	/// <overloads>
	/// Returns this <see cref="XElement"/> and all of it's ancestors up
	/// to the root node.  Optionally an <see cref="XName"/> can be passed
	/// in to target a specific ancestor(s).
	/// <seealso cref="XNode.Ancestors()"/>
	/// </overloads>
	/// <summary>
	/// Returns this <see cref="XElement"/> and all of it's ancestors up to 
	/// the root node.
	/// <seealso cref="XNode.Ancestors()"/>
	/// </summary>
	/// <returns>
	/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing all of
	/// this <see cref="XElement"/>'s ancestors up to the root node (including
	/// this <see cref="XElement"/>.
	/// </returns>
	AncestorsAndSelf():IEnumerable < XElement >
	{
		return GetAncestors(null, true);
	}

	/// <summary>
	/// Returns the ancestor(s) of this <see cref="XElement"/> with the matching
	/// <see cref="XName"/>. If this <see cref="XElement"/>'s <see cref="XName"/>
	/// matches the <see cref="XName"/> passed in then it will be invluded in the 
	/// resulting <see cref="IEnumerable"/> or <see cref="XElement"/>.
	/// <seealso cref="XNode.Ancestors()"/>
	/// </summary>
	/// <param name="name">
	/// The <see cref="XName"/> of the target ancestor.
	/// </param>
	/// <returns>
	/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the
	/// ancestors of this <see cref="XElement"/> with a matching <see cref="XName"/>.
	/// </returns>
	AncestorsAndSelf(name:XName):IEnumerable < XElement >
	{
		return name != null ? GetAncestors(name, true) : XElement.EmptySequence;
	}

	/// <summary>
	/// Returns the <see cref="XAttribute"/> associated with this <see cref="XElement"/> that has this 
	/// <see cref="XName"/>.
	/// </summary>
	/// <param name="name">
	/// The <see cref="XName"/> of the <see cref="XAttribute"/> to get.
	/// </param>
	/// <returns>
	/// The <see cref="XAttribute"/> with the <see cref="XName"/> passed in.  If there is no <see cref="XAttribute"/>
	/// with this <see cref="XName"/> then null is returned.
	/// </returns>
	Attribute(name:XName):XAttribute
	{
		var a: XAttribute = lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				if (a.name == name) return a;
			} while (a != lastAttr);
		}
		return null;
	}

	/// <overloads>
	/// Returns the <see cref="XAttribute"/> associated with this <see cref="XElement"/>.  Optionally
	/// an <see cref="XName"/> can be given to target a specific <see cref="XAttribute"/>(s).
	/// </overloads>
	/// <summary>
	/// Returns all of the <see cref="XAttribute"/>s associated with this <see cref="XElement"/>.
	/// <seealso cref="XContainer.Elements()"/>
	/// </summary>
	/// <returns>
	/// An <see cref="IEnumerable"/> of <see cref="XAttribute"/> containing all of the <see cref="XAttribute"/>s
	/// associated with this <see cref="XElement"/>.
	/// </returns>
	Attributes():IEnumerable < XAttribute >
	{
		return GetAttributes(null);
	}

	/// <summary>
	/// Returns the <see cref="XAttribute"/>(s) associated with this <see cref="XElement"/> that has the passed
	/// in <see cref="XName"/>.
	/// <seealso cref="XElement.Attributes()"/>
	/// </summary>
	/// <param name="name">
	/// The <see cref="XName"/> of the targeted <see cref="XAttribute"/>.
	/// </param>
	/// <returns>
	/// The <see cref="XAttribute"/>(s) with the matching 
	/// </returns>
	Attributes(name:XName):IEnumerable < XAttribute >
	{
		return name != null ? GetAttributes(name) : XAttribute.EmptySequence;
	}

	/// <summary>
	/// Get the self and descendant nodes for an <see cref="XElement"/>
	/// </summary>
	/// <returns></returns>
	DescendantNodesAndSelf():IEnumerable < XNode >
	{
		return GetDescendantNodes(true);
	}

	/// <overloads>
	/// Returns this <see cref="XElement"/> and all of it's descendants.  Overloads allow
	/// specification of a type of descendant to return, or a specific <see cref="XName"/>
	/// of a descendant <see cref="XElement"/> to match.
	/// </overloads>
	/// <summary>
	/// Returns this <see cref="XElement"/> and all of it's descendant <see cref="XElement"/>s
	/// as an <see cref="IEnumerable"/> of <see cref="XElement"/>.
	/// <seealso cref="XElement.DescendantsAndSelf()"/>
	/// </summary>
	/// <returns>
	/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing this <see cref="XElement"/>
	/// and all of it's descendants.
	/// </returns>
	DescendantsAndSelf():IEnumerable < XElement >
	{
		return GetDescendants(null, true);
	}

	/// <summary>
	/// Returns the descendants of this <see cref="XElement"/> that have a matching <see cref="XName"/>
	/// to the one passed in, including, potentially, this <see cref="XElement"/>.
	/// <seealso cref="XElement.DescendantsAndSelf(XName)"/>
	/// </summary>
	/// <param name="name">
	/// The <see cref="XName"/> of the descendant <see cref="XElement"/> that is being targeted.
	/// </param>
	/// <returns>
	/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing all of the descendant
	/// <see cref="XElement"/>s that have this <see cref="XName"/>.
	/// </returns>
	DescendantsAndSelf(name:XName):IEnumerable < XElement >
	{
		return name != null ? GetDescendants(name, true) : XElement.EmptySequence;
	}

	/// <summary>
	/// Returns the default <see cref="XNamespace"/> of an <see cref="XElement"/> 
	/// </summary>
	GetDefaultNamespace():XNamespace
	{
		var namespaceName: string = GetNamespaceOfPrefixInScope("xmlns", null);
		return namespaceName != null ? XNamespace.Get(namespaceName) : XNamespace.None;
	}

	/// <summary>
	/// Get the namespace associated with a particular prefix for this <see cref="XElement"/> 
	/// in its document context. 
	/// </summary>
	/// <param name="prefix">The namespace prefix to look up</param>
	/// <returns>An <see cref="XNamespace"/> for the namespace bound to the prefix</returns>
	GetNamespaceOfPrefix(prefix:string):XNamespace
	{
		if (prefix == null) throw 'ArgumentNullException("prefix")';
		if (prefix.length == 0) throw 'ArgumentException(Res.GetString(Res.Argument_InvalidPrefix, prefix))';
		if (prefix == "xmlns") return XNamespace.Xmlns;
		var namespaceName: string = GetNamespaceOfPrefixInScope(prefix, null);
		if (namespaceName != null) return XNamespace.Get(namespaceName);
		if (prefix == "xml") return XNamespace.Xml;
		return null;
	}

	/// <summary>
	/// Get the prefix associated with a namespace for an element in its context.
	/// </summary>
	/// <param name="ns">The <see cref="XNamespace"/> for which to get a prefix</param>
	/// <returns>The namespace prefix string</returns>
	GetPrefixOfNamespace(ns:XNamespace):string
	{
		if (ns == null) throw 'ArgumentNullException("ns")';
		var namespaceName: string = ns.NamespaceName;
		var hasInScopeNamespace: boolean = false;
		var e: XElement = this;
		do
		{
			var a: XAttribute = e.lastAttr;
			if (a != null)
			{
				var hasLocalNamespace: boolean = false;
				do
				{
					a = a.next;
					if (a.IsNamespaceDeclaration)
					{
						if (a.Value == namespaceName)
						{
							if (a.Name.NamespaceName.length != 0 &&
								(!hasInScopeNamespace ||
									GetNamespaceOfPrefixInScope(a.Name.LocalName, e) == null))
							{
								return a.Name.LocalName;
							}
						}
						hasLocalNamespace = true;
					}
				}
				while (a != e.lastAttr);
				hasInScopeNamespace |= hasLocalNamespace;
			}
			e = e.parent as XElement;
		}
		while (e != null);
		if (<any>namespaceName == <any>XNamespace.xmlPrefixNamespace)
		{
			if (!hasInScopeNamespace || GetNamespaceOfPrefixInScope("xml", null) == null) return "xml";
		}
		else if (<any>namespaceName == <any>XNamespace.xmlnsPrefixNamespace)
		{
			return "xmlns";
		}
		return null;
	}

/// <overloads>
/// The Load method provides multiple strategies for creating a new 
/// <see cref="XElement"/> and initializing it from a data source containing
/// raw XML.  Load from a file (passing in a URI to the file), an
/// <see cref="Stream"/>, a <see cref="TextReader"/>, or an
/// <see cref="XmlReader"/>.  Note:  Use <see cref="XDocument.Parse(string)"/>
/// to create an <see cref="XDocument"/> from a string containing XML.
/// <seealso cref="XDocument.Load(string)" />
/// <seealso cref="XElement.Parse(string)"/>
/// </overloads>
/// <summary>
/// Create a new <see cref="XElement"/> based on the contents of the file 
/// referenced by the URI parameter passed in.  Note: Use 
/// <see cref="XElement.Parse(string)"/> to create an <see cref="XElement"/> from
/// a string containing XML.
/// <seealso cref="XmlReader.Create(string)"/>
/// <seealso cref="XElement.Parse(string)"/>
/// <seealso cref="XDocument.Parse(string)"/>
/// </summary>
/// <remarks>
/// This method uses the <see cref="XmlReader.Create(string)"/> method to create
/// an <see cref="XmlReader"/> to read the raw XML into the underlying
/// XML tree.
/// </remarks>
/// <param name="uri">
/// A URI string referencing the file to load into a new <see cref="XElement"/>.
/// </param>
/// <returns>
/// An <see cref="XElement"/> initialized with the contents of the file referenced
/// in the passed in uri parameter.
/// </returns>
		static Load(uri:string):XElement
	{
		return Load(uri, LoadOptions.None);
	}

/// <summary>
/// Create a new <see cref="XElement"/> based on the contents of the file 
/// referenced by the URI parameter passed in.  Optionally, whitespace can be preserved.  
/// <see cref="XmlReader.Create(string)"/>
/// <seealso cref="XDocument.Load(string, LoadOptions)"/> 
/// </summary>
/// <remarks>
/// This method uses the <see cref="XmlReader.Create(string)"/> method to create
/// an <see cref="XmlReader"/> to read the raw XML into an underlying
/// XML tree. If LoadOptions.PreserveWhitespace is enabled then
/// the <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
/// is set to false.
/// </remarks>
/// <param name="uri">
/// A string representing the URI of the file to be loaded into a new <see cref="XElement"/>.
/// </param>
/// <param name="options">
/// A set of <see cref="LoadOptions"/>.
/// </param>
/// <returns>
/// An <see cref="XElement"/> initialized with the contents of the file referenced
/// in the passed uri parameter.  If LoadOptions.PreserveWhitespace is enabled then
/// significant whitespace will be preserved.
/// </returns>
		static Load(uri:string, options:LoadOptions):XElement
	{
		var rs: XmlReaderSettings = GetXmlReaderSettings(options);
		using(var r: XmlReader = XmlReader.Create(uri, rs))
		{
			return Load(r, options);
		}
	}

		/// <summary>
		/// Create a new <see cref="XElement"/> and initialize its underlying XML tree using
		/// the passed <see cref="Stream"/> parameter.  
		/// </summary>
		/// <param name="stream">
		/// A <see cref="Stream"/> containing the raw XML to read into the newly
		/// created <see cref="XElement"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed in
		/// <see cref="Stream"/>.
		/// </returns>
		static Load(stream:Stream):XElement
	{
		return Load(stream, LoadOptions.None);
	}

		/// <summary>
		/// Create a new <see cref="XElement"/> and initialize its underlying XML tree using
		/// the passed <see cref="Stream"/> parameter.  Optionally whitespace handling
		/// can be preserved.
		/// </summary>
		/// <remarks>
		/// If LoadOptions.PreserveWhitespace is enabled then
		/// the <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
		/// is set to false.
		/// </remarks>
		/// <param name="stream">
		/// A <see cref="Stream"/> containing the raw XML to read into the newly
		/// created <see cref="XElement"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed in
		/// <see cref="Stream"/>.
		/// </returns>
		static Load(stream:Stream, options:LoadOptions):XElement
	{
		var rs: XmlReaderSettings = GetXmlReaderSettings(options);
		using(var r: XmlReader = XmlReader.Create(stream, rs))
		{
			return Load(r, options);
		}
	}
		/// <summary>
		/// Create a new <see cref="XElement"/> and initialize its underlying XML tree using
		/// the passed <see cref="TextReader"/> parameter.  
		/// </summary>
		/// <param name="textReader">
		/// A <see cref="TextReader"/> containing the raw XML to read into the newly
		/// created <see cref="XElement"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed in
		/// <see cref="TextReader"/>.
		/// </returns>
		static Load(textReader:TextReader):XElement
	{
		return Load(textReader, LoadOptions.None);
	}

		/// <summary>
		/// Create a new <see cref="XElement"/> and initialize its underlying XML tree using
		/// the passed <see cref="TextReader"/> parameter.  Optionally whitespace handling
		/// can be preserved.
		/// </summary>
		/// <remarks>
		/// If LoadOptions.PreserveWhitespace is enabled then
		/// the <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
		/// is set to false.
		/// </remarks>
		/// <param name="textReader">
		/// A <see cref="TextReader"/> containing the raw XML to read into the newly
		/// created <see cref="XElement"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed in
		/// <see cref="TextReader"/>.
		/// </returns>
		static Load(textReader:TextReader, options:LoadOptions):XElement
	{
		var rs: XmlReaderSettings = GetXmlReaderSettings(options);
		using(var r: XmlReader = XmlReader.Create(textReader, rs))
		{
			return Load(r, options);
		}
	}

		/// <summary>
		/// Create a new <see cref="XElement"/> containing the contents of the
		/// passed in <see cref="XmlReader"/>.
		/// </summary>
		/// <param name="reader">
		/// An <see cref="XmlReader"/> containing the XML to be read into the new
		/// <see cref="XElement"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed
		/// in <see cref="XmlReader"/>.
		/// </returns>
		static Load(reader:XmlReader):XElement
	{
		return Load(reader, LoadOptions.None);
	}

		/// <summary>
		/// Create a new <see cref="XElement"/> containing the contents of the
		/// passed in <see cref="XmlReader"/>.
		/// </summary>
		/// <param name="reader">
		/// An <see cref="XmlReader"/> containing the XML to be read into the new
		/// <see cref="XElement"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed
		/// in <see cref="XmlReader"/>.
		/// </returns>
		static Load(reader:XmlReader, options:LoadOptions):XElement
	{
		if (reader == null) throw 'ArgumentNullException("reader")';
		if (reader.MoveToContent() != XmlNodeType.Element) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedNodeType, XmlNodeType.Element, reader.NodeType))';
		var e: XElement = new XElement(reader, options);
		reader.MoveToContent();
		if (!reader.EOF) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedEndOfFile))';
		return e;
	}

		/// <overloads>
		/// Parses a string containing XML into an <see cref="XElement"/>.  Optionally
		/// whitespace can be preserved.
		/// </overloads>
		/// <summary>
		/// Parses a string containing XML into an <see cref="XElement"/>.  
		/// </summary>
		/// <remarks>
		/// The XML must contain only one root node.
		/// </remarks>
		/// <param name="text">
		/// A string containing the XML to parse into an <see cref="XElement"/>.
		/// </param>
		/// <returns>
		/// An <see cref="XElement"/> created from the XML string passed in.
		/// </returns>
		static Parse(text:string):XElement
	{
		return Parse(text, LoadOptions.None);
	}

		/// <summary>
		/// Parses a string containing XML into an <see cref="XElement"/> and 
		/// optionally preserves the Whitespace.  See <see cref="XmlReaderSetting.IgnoreWhitespace"/>.
		/// </summary>
		/// <remarks>
		/// <list>
		/// <item>The XML must contain only one root node.</item>
		/// <item>
		/// If LoadOptions.PreserveWhitespace is enabled the underlying 
		/// <see cref="XmlReaderSettings"/>'
		/// property <see cref="XmlReaderSettings.IgnoreWhitespace"/> will be set to false.
		/// </item>
		/// </list>
		/// </remarks>
		/// <param name="text">
		/// A string containing the XML to parse into an <see cref="XElement"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// An <see cref="XElement"/> created from the XML string passed in.
		/// </returns>
		static Parse(text:string, options:LoadOptions):XElement
	{
		using(var sr: StringReader = new StringReader(text))
		{
			XmlReaderSettings rs = GetXmlReaderSettings(options);
			using(var r: XmlReader = XmlReader.Create(sr, rs))
			{
				return Load(r, options);
			}
		}
	}

	/// <summary>
	/// Removes content and attributes from this <see cref="XElement"/>.
	/// <seealso cref="XElement.RemoveAttributes"/>
	/// <seealso cref="XContainer.RemoveNodes"/>
	/// </summary>
	RemoveAll():void
	{
		RemoveAttributes();
		RemoveNodes();
	}

	/// <summary>
	/// Removes that attributes of this <see cref="XElement"/>.
	/// <seealso cref="XElement.RemoveAll"/>
	/// <seealso cref="XElement.RemoveAttributes"/>
	/// </summary>
	RemoveAttributes():void
	{
		if(SkipNotify())
		{
			RemoveAttributesSkipNotify();
			return;
		}
	while (lastAttr != null)
		{
			var a: XAttribute = lastAttr.next;
			NotifyChanging(a, XObjectChangeEventArgs.Remove);
			if (lastAttr == null || a != lastAttr.next) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
			if (a != lastAttr)
			{
				lastAttr.next = a.next;
			}
			else
			{
				lastAttr = null;
			}
			a.parent = null;
			a.next = null;
			NotifyChanged(a, XObjectChangeEventArgs.Remove);
		}
	}

	/// <overloads>
	/// Replaces the child nodes and the attributes of this element with the
	/// specified content. The content can be simple content, a collection of
	/// content objects, a parameter list of content objects, or null.
	/// </overloads>
	/// <summary>
	/// Replaces the children nodes and the attributes of this element with the specified content.
	/// </summary>
	/// <param name="content">
	/// The content that will replace the child nodes and attributes of this element.
	/// </param>
	/// <remarks>
	/// See XContainer.Add(content:any) for details about the content that can be added
	/// using this method.
	/// </remarks>
	ReplaceAll(content:any):void
	{
		content = GetContentSnapshot(content);
		RemoveAll();
		Add(content);
	}

	/// <summary>
	/// Replaces the children nodes and the attributes of this element with the specified content.
	/// </summary>
	/// <param name="content">
	/// A parameter list of content objects.
	/// </param>
	/// <remarks>
	/// See XContainer.Add(content:any) for details about the content that can be added
	/// using this method.
	/// </remarks>
	ReplaceAll(..._content:any[]):void
	{
		ReplaceAll(<object > content);
}

/// <overloads>
/// Replaces the attributes of this element with the specified content.
/// The content can be simple content, a collection of
/// content objects, a parameter list of content objects, or null.
/// </overloads>
/// <summary>
/// Replaces the attributes of this element with the specified content.
/// </summary>
/// <param name="content">
/// The content that will replace the attributes of this element.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
ReplaceAttributes(content:any):void
{
	content = GetContentSnapshot(content);
	RemoveAttributes();
	Add(content);
}

/// <summary>
/// Replaces the attributes of this element with the specified content.
/// </summary>
/// <param name="content">
/// A parameter list of content objects.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
ReplaceAttributes(..._content:any[]):void
{
	ReplaceAttributes(<object > content);
}

///<overloads>
/// Outputs this <see cref="XElement"/>'s underlying XML tree.  The output can
/// be saved to a file, a <see cref="Stream"/>, a <see cref="TextWriter"/>,
/// or an <see cref="XmlWriter"/>.  Optionally whitespace can be preserved.  
/// </overloads>
/// <summary>
/// Output this <see cref="XElement"/> to a file.
/// </summary>
/// <remarks>
/// The format will be indented by default.  If you want
/// no indenting then use the SaveOptions version of Save (see
/// <see cref="XElement.Save(string, SaveOptions)"/>) enabling 
/// SaveOptions.DisableFormatting. 
/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </remarks>
/// <param name="fileName">
/// The name of the file to output the XML to.
/// </param>

Save(fileName:string):void
{
	Save(fileName, GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Output this <see cref="XElement"/> to a file.
/// </summary>
/// <param name="fileName">
/// The name of the file to output the XML to.  
/// </param>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
Save(fileName:string, options:SaveOptions):void
{
	var ws: XmlWriterSettings = GetXmlWriterSettings(options);
	using(var w: XmlWriter = XmlWriter.Create(fileName, ws))
	{
	Save(w);
}
}
/// <summary>
/// Output this <see cref="XElement"/> to the passed in <see cref="Stream"/>.
/// </summary>
/// <remarks>
/// The format will be indented by default.  If you want
/// no indenting then use the SaveOptions version of Save (see
/// <see cref="XElement.Save(Stream, SaveOptions)"/>) enabling 
/// SaveOptions.DisableFormatting.
/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </remarks>
/// <param name="stream">
/// The <see cref="Stream"/> to output this <see cref="XElement"/> to.
/// </param>
Save(stream:Stream):void
{
	Save(stream, GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Output this <see cref="XElement"/> to a <see cref="Stream"/>.
/// </summary>
/// <param name="stream">
/// The <see cref="Stream"/> to output the XML to.  
/// </param>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
Save(stream:Stream, options:SaveOptions):void
{
	var ws: XmlWriterSettings = GetXmlWriterSettings(options);
	using(var w: XmlWriter = XmlWriter.Create(stream, ws))
	{
	Save(w);
}
}

/// <summary>
/// Output this <see cref="XElement"/> to the passed in <see cref="TextWriter"/>.
/// </summary>
/// <remarks>
/// The format will be indented by default.  If you want
/// no indenting then use the SaveOptions version of Save (see
/// <see cref="XElement.Save(TextWriter, SaveOptions)"/>) enabling 
/// SaveOptions.DisableFormatting.
/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </remarks>
/// <param name="textWriter">
/// The <see cref="TextWriter"/> to output this <see cref="XElement"/> to.
/// </param>
Save(textWriter:TextWriter):void
{
	Save(textWriter, GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Output this <see cref="XElement"/> to a <see cref="TextWriter"/>.
/// </summary>
/// <param name="textWriter">
/// The <see cref="TextWriter"/> to output the XML to.  
/// </param>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
Save(textWriter:TextWriter, options:SaveOptions):void
{
	var ws: XmlWriterSettings = GetXmlWriterSettings(options);
	using(var w: XmlWriter = XmlWriter.Create(textWriter, ws))
	{
	Save(w);
}
}

/// <summary>
/// Output this <see cref="XElement"/> to an <see cref="XmlWriter"/>.
/// </summary>
/// <param name="writer">
/// The <see cref="XmlWriter"/> to output the XML to.
/// </param>
Save(writer:XmlWriter):void
{
	if(writer == null) throw 'ArgumentNullException("writer")';
	writer.WriteStartDocument();
	WriteTo(writer);
	writer.WriteEndDocument();
}

/// <summary>
/// Sets the value of an attribute. The value is assigned to the attribute with the given
/// name. If no attribute with the given name exists, a new attribute is added. If the
/// value is null, the attribute with the given name, any:if, is deleted.
/// <seealso cref="XAttribute.SetValue"/>
/// <seealso cref="XElement.SetElementValue"/>
/// <seealso cref="XElement.SetValue"/>
/// </summary>
/// <param name="name">
/// The name of the attribute whose value to change.
/// </param>
/// <param name="value">
/// The value to assign to the attribute. The attribute is deleted if the value is null.
/// Otherwise, the value is converted to its string representation and assigned to the
/// <see cref="Value"/> property of the attribute.
/// </param>
/// <exception cref="ArgumentException">
/// Thrown if the value is an instance of <see cref="XObject"/>.
/// </exception>
SetAttributeValue(name:XName, value:any):void
{
	var a: XAttribute = Attribute(name);
	if(value == null)
	{
		if (a != null) RemoveAttribute(a);
	}
	else
	{
		if(a != null)
		{
			a.Value = GetStringValue(value);
		}
		else
		{
			AppendAttribute(new XAttribute(name, value));
		}
	}
}

/// <summary>
/// Sets the value of a child element. The value is assigned to the first child element
/// with the given name. If no child element with the given name exists, a new child
/// element is added. If the value is null, the first child element with the given name,
/// if any, is deleted.
/// <seealso cref="XAttribute.SetValue"/>
/// <seealso cref="XElement.SetAttributeValue"/>
/// <seealso cref="XElement.SetValue"/>
/// </summary>
/// <param name="name">
/// The name of the child element whose value to change.
/// </param>
/// <param name="value">
/// The value to assign to the child element. The child element is deleted if the value
/// is null. Otherwise, the value is converted to its string representation and assigned
/// to the <see cref="Value"/> property of the child element.
/// </param>
/// <exception cref="ArgumentException">
/// Thrown if the value is an instance of <see cref="XObject"/>.
/// </exception>
SetElementValue(name:XName, value:any):void
{
	var e: XElement = Element(name);
	if(value == null)
	{
		if (e != null) RemoveNode(e);
	}
	else
	{
		if(e != null)
		{
			e.Value = GetStringValue(value);
		}
		else
		{
			AddNode(new XElement(name, GetStringValue(value)));
		}
	}
}

/// <summary>
/// Sets the value of this element.
/// <seealso cref="XAttribute.SetValue"/>
/// <seealso cref="XElement.SetAttributeValue"/>
/// <seealso cref="XElement.SetElementValue"/>
/// </summary>
/// <param name="value">
/// The value to assign to this element. The value is converted to its string representation
/// and assigned to the <see cref="Value"/> property.
/// </param>
/// <exception cref="ArgumentNullException">
/// Thrown if the specified value is null.
/// </exception>
SetValue(value:any):void
{
	if(value == null) throw 'ArgumentNullException("value")';
	Value = GetStringValue(value);
}

/// <summary>
/// Write this <see cref="XElement"/> to the passed in <see cref="XmlTextWriter"/>.
/// </summary>
/// <param name="writer">
/// The <see cref="XmlTextWriter"/> to write this <see cref="XElement"/> to.
/// </param>
WriteTo(writer:XmlWriter):void
{
	if(writer == null) throw 'ArgumentNullException("writer")';
	new ElementWriter(writer).WriteElement(this);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to a <see cref="string"/>.
/// </summary>
/// <remarks>
/// If the <see cref="XElement"/> is a subtre (an <see cref="XElement"/>
/// that has <see cref="XElement"/> children.  The concatenated string
/// value of all of the <see cref="XElement"/>'s text and descendants
/// text is returned.
/// </remarks>
/// <param name="element">
/// The <see cref="XElement"/> to cast to a string.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="string"/>.
/// </returns>
		public static explicit operator string(element:XElement)
{
	if (element == null) return null;
	return element.Value;
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to a <see cref="boolean"/>.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="boolean"/>.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="boolean"/>.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the element does not contain a valid boolean value.
/// </exception>
/// <exception cref="ArgumentNullException">
/// Thrown if the specified element is null.
/// </exception>


		public static explicit operator boolean(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToBoolean(element.Value.ToLower(CultureInfo.InvariantCulture));
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to a <see cref="boolean"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="boolean"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="boolean"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the element does not contain a valid boolean value.
/// </exception>


		public static explicit operator boolean? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToBoolean(element.Value.ToLower(CultureInfo.InvariantCulture));
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to an <see cref="number/*int*/"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="number/*int*/"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="number/*int*/"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the element does not contain a valid integer value.
		/// </exception>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified element is null.
		/// </exception>


		public static explicit operator number/*int*/(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToInt32(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="number/*int*/"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="number/*int*/"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="number/*int*/"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid integer value.
/// </exception>


		public static explicit operator number/*int*/ ? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToInt32(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to an <see cref="uint"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="uint"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="uint"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid unsigned integer value.
		/// </exception>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified element is null.
		/// </exception>


		public static explicit operator uint(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToUInt32(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="uint"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="uint"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="uint"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid unsigned integer value.
/// </exception>


		public static explicit operator uint? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToUInt32(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="long"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="long"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="long"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the element does not contain a valid long integer value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>


		public static explicit operator long(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToInt64(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to a <see cref="long"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="long"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="long"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid long integer value.
/// </exception>


		public static explicit operator long? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToInt64(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to an <see cref="ulong"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="ulong"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="ulong"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid unsigned long integer value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>


		public static explicit operator ulong(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToUInt64(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="ulong"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="ulong"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="ulong"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid unsigned long integer value.
/// </exception>


		public static explicit operator ulong? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToUInt64(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="float"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="float"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="float"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid float value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>


		public static explicit operator float(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToSingle(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="float"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="float"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="float"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid float value.
/// </exception>


		public static explicit operator float? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToSingle(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="double"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="double"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="double"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid double value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>


		public static explicit operator double(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToDouble(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="double"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="double"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="double"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid double value.
/// </exception>


		public static explicit operator double? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToDouble(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="decimal"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="decimal"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="decimal"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid decimal value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>        


		public static explicit operator decimal(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToDecimal(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="decimal"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="decimal"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="decimal"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid decimal value.
/// </exception>


		public static explicit operator decimal? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToDecimal(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="DateTime"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="DateTime"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="DateTime"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid <see cref="DateTime"/> value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>        


		public static explicit operator DateTime(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return DateTime.Parse(element.Value, CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.RoundtripKind);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="DateTime"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="DateTime"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="DateTime"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid <see cref="DateTime"/> value.
/// </exception>


		public static explicit operator DateTime? (element: XElement)
		{
	if (element == null) return null;
	return DateTime.Parse(element.Value, CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.RoundtripKind);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="DateTimeOffset"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="DateTimeOffset"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="DateTimeOffset"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid <see cref="DateTimeOffset"/> value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>        


		public static explicit operator DateTimeOffset(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToDateTimeOffset(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="DateTimeOffset"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="DateTimeOffset"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="DateTimeOffset"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid <see cref="DateTimeOffset"/> value.
/// </exception>


		public static explicit operator DateTimeOffset? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToDateTimeOffset(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="TimeSpan"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="TimeSpan"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="TimeSpan"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid <see cref="TimeSpan"/> value.
		/// </exception>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified element is null.
		/// </exception>


		public static explicit operator TimeSpan(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToTimeSpan(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="TimeSpan"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="TimeSpan"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="TimeSpan"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid <see cref="TimeSpan"/> value.
/// </exception>


		public static explicit operator TimeSpan? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToTimeSpan(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="Guid"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="Guid"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="Guid"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid guid.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>


		public static explicit operator Guid(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToGuid(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="Guid"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="Guid"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="Guid"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid guid.
/// </exception>


		public static explicit operator Guid? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToGuid(element.Value);
}

		/// <summary>
		/// This method is obsolete for the IXmlSerializable contract.
		/// </summary>
		XmlSchema IXmlSerializable.GetSchema()
{
	return null;
}

/// <summary>
/// Generates a <see cref="XElement"/> from its XML respresentation.
/// </summary>
/// <param name="reader">
/// The <see cref="XmlReader"/> stream from which the <see cref="XElement"/>
/// is deserialized.
/// </param>
void IXmlSerializable.ReadXml(reader:XmlReader)
{
	if (reader == null) throw 'ArgumentNullException("reader")';
	if (parent != null || annotations != null || content != null || lastAttr != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_DeserializeInstance))';
	if (reader.MoveToContent() != XmlNodeType.Element) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedNodeType, XmlNodeType.Element, reader.NodeType))';
	ReadElementFrom(reader, LoadOptions.None);
}

/// <summary>
/// Converts a <see cref="XElement"/> into its XML representation.
/// </summary>
/// <param name="writer">
/// The <see cref="XmlWriter"/> stream to which the <see cref="XElement"/>
/// is serialized.
/// </param>
void IXmlSerializable.WriteXml(writer:XmlWriter)
{
	WriteTo(writer);
}

	/*internal*/ void _addAttribute(a:XAttribute)
{
	if (Attribute(a.Name) != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_DuplicateAttribute))';
	if (a.parent != null) a = new XAttribute(a);
	AppendAttribute(a);
}

	/*internal*/ void _addAttributeSkipNotify(a:XAttribute)
{
	if (Attribute(a.Name) != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_DuplicateAttribute))';
	if (a.parent != null) a = new XAttribute(a);
	AppendAttributeSkipNotify(a);
}

	/*internal*/ void AppendAttribute(a:XAttribute)
{
	var notify: boolean = NotifyChanging(a, XObjectChangeEventArgs.Add);
	if (a.parent != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
	AppendAttributeSkipNotify(a);
	if (notify) NotifyChanged(a, XObjectChangeEventArgs.Add);
}

	/*internal*/ void AppendAttributeSkipNotify(a:XAttribute)
{
	a.parent = this;
	if (lastAttr == null)
	{
		a.next = a;
	}
	else
	{
		a.next = lastAttr.next;
		lastAttr.next = a;
	}
	lastAttr = a;
}

private AttributesEqual(e:XElement):boolean
{
	var a1: XAttribute = lastAttr;
	var a2: XAttribute = e.lastAttr;
	if (a1 != null && a2 != null)
	{
		do
		{
			a1 = a1.next;
			a2 = a2.next;
			if (a1.name != a2.name || a1.value != a2.value) return false;
		} while (a1 != lastAttr);
		return a2 == e.lastAttr;
	}
	return a1 == null && a2 == null;
}

	/*internal*/ XNode CloneNode()
{
	return new XElement(this);
}

	/*internal*/ boolean DeepEquals(node:XNode)
{
	var e: XElement = node as XElement;
	return e != null && name == e.name && ContentsEqual(e) && AttributesEqual(e);
}

IEnumerable < XAttribute > GetAttributes(name:XName)
{
	var a: XAttribute = lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			if (name == null || a.name == name) yield return a;
		} while (a.parent == this && a != lastAttr);
	}
}

private GetNamespaceOfPrefixInScope(prefix:string, outOfScope:XElement):string
{
	var e: XElement = this;
	while (e != outOfScope)
	{
		var a: XAttribute = e.lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				if (a.IsNamespaceDeclaration && a.Name.LocalName == prefix) return a.Value;
			}
			while (a != e.lastAttr);
		}
		e = e.parent as XElement;
	}
	return null;
}

	/*internal*/ number/*int*/ GetDeepHashCode()
{
	var h: number/*int*/ = name.GetHashCode();
	h ^= ContentsHashCode();
	var a: XAttribute = lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			h ^= a.GetDeepHashCode();
		} while (a != lastAttr);
	}
	return h;
}

private ReadElementFrom(r:XmlReader, o:LoadOptions):void
{
	if(r.ReadState != ReadState.Interactive) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedInteractive))';
	name = XNamespace.Get(r.NamespaceURI).GetName(r.LocalName);
	if((o & LoadOptions.SetBaseUri) != 0)
{
	var baseUri: string = r.BaseURI;
	if (baseUri != null && baseUri.length != 0)
	{
		SetBaseUri(baseUri);
	}
}
var li: IXmlLineInfo = null;
if ((o & LoadOptions.SetLineInfo) != 0)
{
	li = r as IXmlLineInfo;
	if (li != null && li.HasLineInfo())
	{
		SetLineInfo(li.LineNumber, li.LinePosition);
	}
}
if (r.MoveToFirstAttribute())
{
	do
	{
		var a: XAttribute = new XAttribute(XNamespace.Get(r.Prefix.length == 0 ? string.Empty : r.NamespaceURI).GetName(r.LocalName), r.Value);
		if (li != null && li.HasLineInfo())
		{
			a.SetLineInfo(li.LineNumber, li.LinePosition);
		}
		AppendAttributeSkipNotify(a);
	} while (r.MoveToNextAttribute());
	r.MoveToElement();
}
if (!r.IsEmptyElement)
{
	r.Read();
	ReadContentFrom(r, o);
}
r.Read();
}

	/*internal*/ void RemoveAttribute(a:XAttribute)
{
	var notify: boolean = NotifyChanging(a, XObjectChangeEventArgs.Remove);
	if (a.parent != this) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
	var p: XAttribute = lastAttr, n;
	while ((n = p.next) != a) p = n;
	if (p == a)
	{
		lastAttr = null;
	}
	else
	{
		if (lastAttr == a) lastAttr = p;
		p.next = a.next;
	}
	a.parent = null;
	a.next = null;
	if (notify) NotifyChanged(a, XObjectChangeEventArgs.Remove);
}

private RemoveAttributesSkipNotify():void
{
	if(lastAttr != null)
	{
		var a: XAttribute = lastAttr;
		do
		{
			var next: XAttribute = a.next;
			a.parent = null;
			a.next = null;
			a = next;
		} while (a != lastAttr);
		lastAttr = null;
	}
}

	/*internal*/ void SetEndElementLineInfo(lineNumber:number/*int*/, linePosition:number/*int*/)
{
	AddAnnotation(new LineInfoEndElementAnnotation(lineNumber, linePosition));
}

	/*internal*/ void _validateNode(node:XNode, previous:XNode)
{
	if (node is XDocument) throw 'ArgumentException(Res.GetString(Res.Argument_AddNode, XmlNodeType.Document))';
	if (node is XDocumentType) throw 'ArgumentException(Res.GetString(Res.Argument_AddNode, XmlNodeType.DocumentType))';
}
}

/*internal*/ struct ElementWriter
{
	private writer: XmlWriter;
private resolver: NamespaceResolver;

		public ElementWriter(writer:XmlWriter)
	{
		this.writer = writer;
		this.resolver = new NamespaceResolver();
	}

	WriteElement(e:XElement):void
	{
		PushAncestors(e);
		var root: XElement = e;
		var n: XNode = e;
		while(true)
	{
		e = n as XElement;
		if (e != null)
		{
			WriteStartElement(e);
			if (e._content == null)
			{
				WriteEndElement();
			}
			else
			{
				var s: string = e._content as string;
				if (s != null)
				{
					writer.WriteString(s);
					WriteFullEndElement();
				}
				else
				{
					n = (<XNode>e._content).next;
					continue;
				}
			}
		}
		else
		{
			n.WriteTo(writer);
		}
		while (n != root && n == n.parent._content)
		{
			n = n.parent;
			WriteFullEndElement();

		}
		if (n == root) break;
		n = n.next;
	}
}

private GetPrefixOfNamespace(ns:XNamespace, allowDefaultNamespace:boolean):string
{
	var namespaceName: string = ns.NamespaceName;
	if (namespaceName.length == 0) return string.Empty;
	var prefix: string = resolver.GetPrefixOfNamespace(ns, allowDefaultNamespace);
	if (prefix != null) return prefix;
	if (<any>namespaceName == <any>XNamespace.xmlPrefixNamespace) return "xml";
	if (<any>namespaceName == <any>XNamespace.xmlnsPrefixNamespace) return "xmlns";
	return null;
}

private PushAncestors(e:XElement):void
{
	while(true)
	{
	e = e.parent as XElement;
	if (e == null) break;
	var a: XAttribute = e.lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			if (a.IsNamespaceDeclaration)
			{
				resolver.AddFirst(a.Name.NamespaceName.length == 0 ? string.Empty : a.Name.LocalName, XNamespace.Get(a.Value));
			}
		} while (a != e.lastAttr);
	}
}
}

private PushElement(e:XElement):void
{
	resolver.PushScope();
	var a: XAttribute = e.lastAttr;
	if(a != null)
	{
		do
		{
			a = a.next;
			if (a.IsNamespaceDeclaration)
			{
				resolver.Add(a.Name.NamespaceName.length == 0 ? string.Empty : a.Name.LocalName, XNamespace.Get(a.Value));
			}
		} while (a != e.lastAttr);
	}
}

private WriteEndElement():void
{
	writer.WriteEndElement();
	resolver.PopScope();
}

private WriteFullEndElement():void
{
	writer.WriteFullEndElement();
	resolver.PopScope();
}

private WriteStartElement(e:XElement):void
{
	PushElement(e);
	var ns: XNamespace = e.Name.Namespace;
	writer.WriteStartElement(GetPrefixOfNamespace(ns, true), e.Name.LocalName, ns.NamespaceName);
	var a: XAttribute = e.lastAttr;
	if(a != null)
	{
		do
		{
			a = a.next;
			ns = a.Name.Namespace;
			var localName: string = a.Name.LocalName;
			var namespaceName: string = ns.NamespaceName;
			writer.WriteAttributeString(GetPrefixOfNamespace(ns, false), localName, namespaceName.length == 0 && localName == "xmlns" ? XNamespace.xmlnsPrefixNamespace : namespaceName, a.Value);
		} while (a != e.lastAttr);
	}
}


	}
}

