///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
module System.Xml.Linq
{
	/// <summary>
	/// Represents a class that allows elements to be streamed
	/// on input and output.
	/// </summary>
	export class XStreamingElement
	{
		/// <summary>
		/// Creates a <see cref="XStreamingElement"/> node with a given name and content
		/// </summary>
		/// <param name="name">The name to assign to the new <see cref="XStreamingElement"/> node</param>
		/// <param name="content">The content to assign to the new <see cref="XStreamingElement"/> node</param>
		constructor(
			private _name: XName,
			public _content: any)
		{
			if (_name == null) throw 'ArgumentNullException("name")';
			if (_content instanceof Array)
				this._content = _content = [_content];
		}

		/// <summary>
		/// Gets or sets the name of this streaming element.
		/// </summary>
		get name(): XName
		{
			return this._name;
		}
		set name(value: XName)
		{
			if (value == null) throw 'ArgumentNullException("value")';
			this._name = value;
		}


		/// <summary>
		/// Add content to an <see cref="XStreamingElement"/>
		/// </summary>
		/// <param name="content">Object containg content to add</param>
		add(content: any): void
		{
			if (content != null)
			{
				var c = this._content;
				if (!c || !(c instanceof Array))
					this._content = c = c ? [c] : [];
				c.push(content);
			}
		}

		/// <summary>
		/// Add content to an <see cref="XStreamingElement"/>
		/// </summary>
		/// <param name="content">array of objects containg content to add</param>
		addThese(...content: any[]): void
		{
			this.add(content);
		}


		///// <summary>
		///// Save an <see cref="XStreamingElement"/> to a file with formatting.
		///// </summary>
		///// <param name="fileName">Name of file to write content to</param>
		//save(fileName: string): void
		//{
		//	this.save(fileName, SaveOptions.None);
		//}

		///// <summary>
		///// Save an <see cref="XStreamingElement"/> to a file, optionally formatting. 
		///// </summary>
		///// <param name="fileName">Name of file to write content to</param>
		///// <param name="options">
		///// If SaveOptions.DisableFormatting is enabled the output is not indented.
		///// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
		///// </param>
		//save(fileName: string, options: SaveOptions): void
		//{
		//	var ws: XmlWriterSettings = XNode.GetXmlWriterSettings(options);
		//	using(var w: XmlWriter = XmlWriter.Create(fileName, ws))
		//	{
		//		this.save(w);
		//	}
		//}

		///// <summary>
		///// Save the contents of an <see cref="XStreamingElement"/> to a <see cref="Stream"/>
		///// with formatting.
		///// </summary>
		///// <param name="stream"><see cref="Stream"/> to write to </param>      
		//save(stream: Stream): void
		//{
		//	this.save(stream, SaveOptions.None);
		//}

		///// <summary>
		///// Save the contents of an <see cref="XStreamingElement"/> to a <see cref="Stream"/>,
		///// optionally formatting.
		///// </summary>
		///// <param name="stream"><see cref="Stream"/> to write to </param>
		///// <param name="options">
		///// If SaveOptions.DisableFormatting is enabled the output is not indented.
		///// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
		///// </param>
		//save(stream: Stream, options: SaveOptions): void
		//{
		//	var ws: XmlWriterSettings = XNode.GetXmlWriterSettings(options);
		//	using(var w: XmlWriter = XmlWriter.Create(stream, ws))
		//	{
		//		this.save(w);
		//	}
		//}

		///// <summary>
		///// Save the contents of an <see cref="XStreamingElement"/> to a text writer
		///// with formatting.
		///// </summary>
		///// <param name="textWriter"><see cref="TextWriter"/> to write to </param>      
		//save(textWriter: TextWriter): void
		//{
		//	this.save(textWriter, SaveOptions.None);
		//}

		///// <summary>
		///// Save the contents of an <see cref="XStreamingElement"/> to a text writer
		///// optionally formatting.
		///// </summary>
		///// <param name="textWriter"><see cref="TextWriter"/> to write to </param>
		///// <param name="options">
		///// If SaveOptions.DisableFormatting is enabled the output is not indented.
		///// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
		///// </param>
		//save(textWriter: TextWriter, options: SaveOptions): void
		//{
		//	var ws: XmlWriterSettings = XNode.GetXmlWriterSettings(options);
		//	using(var w: XmlWriter = XmlWriter.Create(textWriter, ws))
		//	{
		//		this.save(w);
		//	}
		//}

		///// <summary>
		///// Save the contents of an <see cref="XStreamingElement"/> to an XML writer, not preserving whitepace
		///// </summary>
		///// <param name="writer"><see cref="XmlWriter"/> to write to </param>    
		//save(writer: XmlWriter): void
		//{
		//	if (writer == null) throw 'ArgumentNullException("writer")';
		//	writer.WriteStartDocument();
		//	this.writeTo(writer);
		//	writer.WriteEndDocument();
		//}

		///// <summary>
		///// Get the XML content of an <see cref="XStreamingElement"/> as a 
		///// formatted string.
		///// </summary>
		///// <returns>The XML text as a formatted string</returns>
		//toString(): string
		//{
		//	return this.getXmlString(SaveOptions.None);
		//}

		///// <summary>
		///// Gets the XML content of this streaming element as a string.
		///// </summary>
		///// <param name="options">
		///// If SaveOptions.DisableFormatting is enabled the content is not indented.
		///// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
		///// </param>
		///// <returns>An XML string</returns>
		//toString(options: SaveOptions): string
		//{
		//	return this.getXmlString(options);
		//}

		///// <summary>
		///// Write this <see cref="XStreamingElement"/> to an <see cref="XmlWriter"/>
		///// </summary>
		///// <param name="writer"></param>
		//writeTo(writer: XmlWriter): void
		//{
		//	if (writer == null) throw 'ArgumentNullException("writer")';
		//	new StreamingElementWriter(writer).WriteStreamingElement(this);
		//}

		//getXmlString(o: SaveOptions): string
		//{
		//	using(var sw: StringWriter = new StringWriter(CultureInfo.InvariantCulture))
		//	{
		//		XmlWriterSettings ws = new XmlWriterSettings();
		//		ws.OmitXmlDeclaration = true;
		//		if ((o & SaveOptions.DisableFormatting) == 0) ws.Indent = true;
		//		if ((o & SaveOptions.OmitDuplicateNamespaces) != 0) ws.NamespaceHandling |= NamespaceHandling.OmitDuplicates;
		//		using(var w: XmlWriter = XmlWriter.Create(sw, ws))
		//		{
		//			this.writeTo(w);
		//		}
		//		return sw.ToString();
		//	}
		//}
	}
} 