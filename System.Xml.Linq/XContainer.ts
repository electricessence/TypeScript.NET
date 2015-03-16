///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System.Xml.Linq
{
	import LinkedList = System.Collections.LinkedList;
	import EnumeratorBase = System.Collections.EnumeratorBase;
	import Enumerable = System.Linq.Enumerable;


	class Inserter
	{

		constructor(
			public parent: XContainer,
			public previous: XNode,
			public text: string = null)
		{
		}

		add(content: any): void
		{
			var _ = this, parent = _.parent, previous = _.previous, text = _.text;
			_.addContent(content);
			if (text != null)
			{
				if (parent._content == null)
				{
					if (parent._skipNotify())
					{
						parent._content = text;
					}
					else
					{
						if (text.length > 0)
						{
							_.insertNode(new XText(text));
						}
						else
						{
							if (parent instanceof XElement)
							{
								// Change in the serialization of an empty element: 
								// from empty tag to start/end tag pair
								parent._notifyChanging(parent, XObjectChangeEventArgs.value);
								if (parent._content != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
								parent._content = text;
								parent._notifyChanged(parent, XObjectChangeEventArgs.value);
							}
							else
							{
								parent._content = text;
							}
						}
					}
				}
				else if (text.length > 0)
				{
					if (previous instanceof XText && !(previous instanceof XCData))
					{
						(<XText>previous).value += text;
					}
					else
					{
						parent.ConvertTextToNode();
						_.insertNode(new XText(text));
					}
				}
			}
		}


		addContent(content: any): void
		{
			var _ = this
			if (System.isNullOrUndefined(content)) return;

			if (content instanceof XNode)
			{
				_.addNode(content);
				return;
			}

			if (Types.isString(content))
			{
				_.addString(content);
				return;
			}

			if (content instanceof XStreamingElement)
			{
				_.addNode(new XElement(content));
				return;
			}

			if (content instanceof Array || "getEnumerator" in content)
			{
				Enumerable
					.from(content)
					.forEach(o=> _.add(o));
				return;
			}

			if (content instanceof XAttribute) throw 'ArgumentException(Res.GetString(Res.Argument_AddAttribute))';

			_.addString(XContainer.GetStringValue(content));
		}


		addNode(n: XNode): void
		{
			var _ = this, parent = _.parent, previous = _.previous;
			parent._validateNode(n, previous);
			if (n.parent != null)
			{
				n = n.CloneNode();
			}
			else
			{
				var p: XNode = parent;
				while (p.parent != null) p = p.parent;
				if (n == p) n = n.CloneNode();
			}
			parent.ConvertTextToNode();
			if (text != null)
			{
				if (text.length > 0)
				{
					if (previous instanceof XText && !(previous instanceof XCData))
					{
						(<XText>previous).Value += text;
					}
					else
					{
						insertNode(new XText(text));
					}
				}
				text = null;
			}
			insertNode(n);
		}

		addString(s: string): void
		{
			this.parent._validateString(s);
			this.text += s;
		}

		// Prepends if previous == null, otherwise inserts after previous
		insertNode(n: XNode): void
		{
			var parent = this.parent, previous = this.previous;
			var notify: boolean = parent._notifyChanging(n, XObjectChangeEventArgs.add);
			if (n._parent != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
			n._parent = parent;
			if (parent._content == null || Types.isString(parent._content))
			{
				n._next = n;
				parent._content = n;
			}
			else if (previous == null)
			{
				var last: XNode = <XNode>parent._content;
				n._next = last._next;
				last._next = n;
			}
			else
			{
				n._next = previous._next;
				previous._next = n;
				if (parent._content == previous) parent._content = n;
			}
			previous = n;
			if (notify) parent._notifyChanged(n, XObjectChangeEventArgs.add);
		}
	}

	// Abstract class for maintaining child nodes and content.
	export class XContainer extends XNode
	{
		_content: any;

		// Is supposed to be internal.
		constructor(other?: XContainer)
		{
			super();
			var _ = this;
			if (other)
			{
				var content = other._content;
				if (content != null)
				{
					if (Types.isString(content))
						_._content = content;
					else
					{
						var n = content;
						do
						{
							n = n._next;
							_._appendNodeSkipNotify(n.CloneNode());
						} while (n != content);
					}
				}
			}

		}

		// Validate insertion of the given node. previous is the node after which insertion
		// will occur. previous == null means at beginning, previous == this means at end.
		/*internal*/ /*virtual*/
		_validateNode(node: XNode, previous: XNode): void
		{
		}

		/*internal*/ /*virtual*/
		_validateString(s: string): void
		{
		}

	

		/*internal*/ /*virtual*/
		_addAttribute(a: XAttribute): void
		{
		}

		/*internal*/ /*virtual*/
		_addAttributeSkipNotify(a: XAttribute): void
		{
		}

		/// <summary>
		/// Get the first child node of this node.
		/// </summary>
		get firstNode(): XNode
		{
			var last = this.lastNode;
			return last != null ? last._next : null;
		}


		/// <summary>
		/// Get the last child node of this node.
		/// </summary>
		get lastNode(): XNode
		{
			var content = this._content;
			if (!content) return null; // Includes "", 0, null, undefined.

			if (Types.isString(content))
			{
				var t = new XText(content);
				t._parent = this;
				t._next = t; // Loop it.
				content = t;
			}

			return content;
		}

		///<overloads>
		/// Returns the content of this <see cref="XContainer"/>.  Note that the content does not
		/// include <see cref="XAttribute"/>s.
		/// <seealso cref="XElement.Attributes()"/>
		/// </overloads>
		/// <summary>
		/// Returns the content of this <see cref="XContainer"/> as an <see cref="IEnumerable"/> of <see cref="object"/>.  Note
		/// that the content does not include <see cref="XAttribute"/>s.
		/// <seealso cref="XElement.Attributes()"/>
		/// </summary>
		/// <returns>The contents of this <see cref="XContainer"/></returns>        
		nodes(): Enumerable<XNode>
		{
			var _ = this, n = _.lastNode;
			if (!n) return Enumerable.empty<XNode>();

			return new Enumerable<XNode>(
				() =>
				{
					var started: boolean;
					return new EnumeratorBase<XNode>(
						() =>
						{
							started = true;
						},
						yielder=>
						{
							n = n._next;

							if (started)
							{
								if (n._parent != _ || n == _._content)
									return yielder.yieldBreak();
							} else
							{
								started = true;
							}

							return yielder.yieldReturn(n);
						}
						)
				});
		}

		_appendNodeSkipNotify(n: XNode)
		{
			var _ = this, content = _._content;
			n._parent = _;
			if (content == null || Types.isString(content))
			{
				n._next = n;
			}
			else
			{
				var x: XNode = content;
				n._next = x._next;
				x._next = n;
			}
			_._content = n;
		}



		add(content: any): void
		{
			var _ = this
			if (_._skipNotify())
			{
				_._addContentSkipNotify(content);
				return;
			}
			if (System.isNullOrUndefined(content)) return;

			if (content instanceof XNode)
			{
				_.addNode(content);
				return;
			}

			if (Types.isString(content))
			{
				_.addString(content);
				return;
			}

			if (content instanceof XAttribute)
			{
				_._addAttribute(content);
				return;
			}

			if (content instanceof XStreamingElement)
			{
				_.addNode(new XElement(content));
				return;
			}

			if (content instanceof Array || "getEnumerator" in content)
			{
				Enumerable
					.from(content)
					.forEach(o=> _.add(o));
				return;
			}

			_.addString(GetStringValue(content));
		}

		/// <summary>
		/// Adds the specified content as a child (or children) of this XContainer.
		/// </summary>
		/// <param name="content">
		/// A parameter list of content objects.
		/// </param>
		/// <remarks>
		/// See XContainer.Add(object content) for details about the content that can be added
		/// using this method.
		/// </remarks>
		addThese(..._content: any[])
		{
			this.add(content);
		}

		/// <summary>
		/// Adds the specified content as the first children of this document or element.
		/// </summary>
		/// <param name="content">
		/// A parameter list of content objects.
		/// </param>
		/// <remarks>
		/// See XContainer.Add(content:any) for details about the content that can be added
		/// using this method.
		/// </remarks>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the parent is null.
		/// </exception>
		AddFirst(..._content: any[]): void
		{
			AddFirst(<object > content);
		}

		/// <summary>
		/// Creates an <see cref="XmlWriter"/> used to add either nodes 
		/// or attributes to the <see cref="XContainer"/>. The later option
		/// applies only for <see cref="XElement"/>.
		/// </summary>
		/// <returns>An <see cref="XmlWriter"/></returns>
		CreateWriter(): XmlWriter
		{
			var settings: XmlWriterSettings = new XmlWriterSettings();
			settings.ConformanceLevel = this instanceof XDocument ? ConformanceLevel.Document : ConformanceLevel.Fragment;
			return XmlWriter.Create(new XNodeBuilder(this), settings);
		}

		/// <summary>
		/// Get descendant elements plus leaf nodes contained in an <see cref="XContainer"/>
		/// </summary>
		/// <returns>IEnumerable<XNode> over all descendants</XNode></returns>
		public IEnumerable<XNode> DescendantNodes()
		{
			return GetDescendantNodes(false);
		}

		/// <summary>
		/// Returns the descendant <see cref="XElement"/>s of this <see cref="XContainer"/>.  Note this method will
		/// not return itself in the resulting IEnumerable.  See <see cref="XElement.DescendantsAndSelf()"/> if you
		/// need to include the current <see cref="XElement"/> in the results.  
		/// <seealso cref="XElement.DescendantsAndSelf()"/>
		/// </summary>
		/// <returns>
		/// An IEnumerable of <see cref="XElement"/> with all of the descendants below this <see cref="XContainer"/> in the XML tree.
		/// </returns>
		public IEnumerable<XElement> Descendants()
		{
			return GetDescendants(null, false);
		}

		/// <summary>
		/// Returns the Descendant <see cref="XElement"/>s with the passed in <see cref="XName"/> as an IEnumerable
		/// of XElement.
		/// </summary>
		/// <param name="name">The <see cref="XName"/> to match against descendant <see cref="XElement"/>s.</param>
		/// <returns>An <see cref="IEnumerable"/> of <see cref="XElement"/></returns>        
		public IEnumerable<XElement> Descendants(name: XName)
		{
			return name != null ? GetDescendants(name, false) : XElement.EmptySequence;
		}

		/// <summary>
		/// Returns the child element with this <see cref="XName"/> or null if there is no child element
		/// with a matching <see cref="XName"/>.
		/// <seealso cref="XContainer.Elements()"/>
		/// </summary>
		/// <param name="name">
		/// The <see cref="XName"/> to match against this <see cref="XContainer"/>s child elements.
		/// </param>
		/// <returns>
		/// An <see cref="XElement"/> child that matches the <see cref="XName"/> passed in, or null.
		/// </returns>
		Element(name: XName): XElement
		{
			var n: XNode = content as XNode;
			if (n != null)
			{
				do
				{
					n = n._next;
					var e: XElement = n as XElement;
					if (e != null && e.name == name) return e;
				} while (n != content);
			}
			return null;
		}

		///<overloads>
		/// Returns the child <see cref="XElement"/>s of this <see cref="XContainer"/>.
		/// </overloads>
		/// <summary>
		/// Returns all of the child elements of this <see cref="XContainer"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> over all of this <see cref="XContainer"/>'s child <see cref="XElement"/>s.
		/// </returns>
		public IEnumerable<XElement> Elements()
		{
			return GetElements(null);
		}

		/// <summary>
		/// Returns the child elements of this <see cref="XContainer"/> that match the <see cref="XName"/> passed in.
		/// </summary>
		/// <param name="name">
		/// The <see cref="XName"/> to match against the <see cref="XElement"/> children of this <see cref="XContainer"/>.
		/// </param>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> children of this <see cref="XContainer"/> that have
		/// a matching <see cref="XName"/>.
		/// </returns>
		public IEnumerable<XElement> Elements(name: XName)
		{
			return name != null ? GetElements(name) : XElement.EmptySequence;
		}


		/// <summary>
		/// Removes the nodes from this <see cref="XContainer"/>.  Note this
		/// methods does not remove attributes.  See <see cref="XElement.RemoveAttributes()"/>.
		/// <seealso cref="XElement.RemoveAttributes()"/>
		/// </summary>
		RemoveNodes(): void
		{
			var _ = this;
			if (_.skipNotify())
			{
				RemoveNodesSkipNotify();
				return;
			}
			while (content != null)
			{
				var s: string = content as string;
				if (s != null)
				{
					if (s.length > 0)
					{
						ConvertTextToNode();
					}
					else
					{
						if (this instanceof XElement)
						{
							// Change in the serialization of an empty element: 
							// from start/end tag pair to empty tag
							NotifyChanging(this, XObjectChangeEventArgs.Value);
							if (<any>s != <any>content) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
							content = null;
							NotifyChanged(this, XObjectChangeEventArgs.Value);
						}
						else
						{
							content = null;
						}
					}

					var last: XNode = content as XNode;
					if (last != null)
					{
						var n: XNode = last._next;
						NotifyChanging(n, XObjectChangeEventArgs.Remove);
						if (last != content || n != last._next) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
						if (n != last)
						{
							last._next = n._next;
						}
						else
						{
							content = null;
						}
						n.parent = null;
						n._next = null;
						NotifyChanged(n, XObjectChangeEventArgs.Remove);
					}
				}


				/// <overloads>
				/// Replaces the children nodes of this document or element with the specified content. The
				/// content can be simple content, a collection of content objects, a parameter
				/// list of content objects, or null.
				/// </overloads>
				/// <summary>
				/// Replaces the children nodes of this document or element with the specified content.
				/// </summary>
				/// <param name="content">
				/// A content object containing simple content or a collection of content objects
				/// that replace the children nodes.
				/// </param>
				/// <remarks>
				/// See XContainer.Add(content:any) for details about the content that can be added
				/// using this method.
				/// </remarks>
				ReplaceNodes(content: any): void
				{
					content = GetContentSnapshot(content);
					RemoveNodes();
					Add(content);
				}

				/// <summary>
				/// Replaces the children nodes of this document or element with the specified content.
				/// </summary>
				/// <param name="content">
				/// A parameter list of content objects.
				/// </param>
				/// <remarks>
				/// See XContainer.Add(content:any) for details about the content that can be added
				/// using this method.
				/// </remarks>
				ReplaceNodes(..._content: any[]): void
				{
					ReplaceNodes(<object > content);


	/*internal*/  AddContentSkipNotify(content: any): void
				{
					if(content == null) return;
					var n: XNode = content as XNode;
					if(n != null)
					{
						AddNodeSkipNotify(n);
						return;
					}
		var s: string = content as string;
					if(s != null)
					{
						AddStringSkipNotify(s);
						return;
					}
		var a: XAttribute = content as XAttribute;
					if(a != null)
					{
						_addAttributeSkipNotify(a);
						return;
					}
		var x: XStreamingElement = content as XStreamingElement;
					if(x != null)
					{
						AddNodeSkipNotify(new XElement(x));
						return;
					}
		object[] o = content as object[];
					if(o != null)
					{
						foreach(object obj in o) AddContentSkipNotify(obj);
						return;
					}
		var e: IEnumerable = content as IEnumerable;
					if(e != null)
					{
						foreach(object obj in e) AddContentSkipNotify(obj);
						return;
					}
		AddStringSkipNotify(GetStringValue(content));
				}

	/*internal*/  AddNode(n: XNode): void
				{
					_validateNode(n, this);
					if(n.parent != null)
					{
						n = n.CloneNode();
					}
		else
		{
						var p: XNode = this;
						while(p.parent != null) p = p.parent;
						if(n == p) n = n.CloneNode();
					}
		ConvertTextToNode();
					AppendNode(n);
				}

	/*internal*/  AddNodeSkipNotify(n: XNode): void
				{
					_validateNode(n, this);
					if(n.parent != null)
					{
						n = n.CloneNode();
					}
		else
		{
						var p: XNode = this;
						while(p.parent != null) p = p.parent;
						if(n == p) n = n.CloneNode();
					}
		ConvertTextToNode();
					AppendNodeSkipNotify(n);
				}

	/*internal*/  AddString(s: string): void
				{
					_validateString(s);
					if(content == null)
					{
						if (s.length > 0)
						{
							AppendNode(new XText(s));
						}
						else
						{
							if (this instanceof XElement)
							{
								// Change in the serialization of an empty element: 
								// from empty tag to start/end tag pair
								NotifyChanging(this, XObjectChangeEventArgs.Value);
								if (content != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
								content = s;
								NotifyChanged(this, XObjectChangeEventArgs.Value);
							}
							else
							{
								content = s;
							}
						}
					}
	else if (s.length > 0)
					{
						ConvertTextToNode();
						var tn: XText = content as XText;
						if (tn != null && !(tn instanceof XCData))
						{
							tn.Value += s;
						}
						else
						{
							AppendNode(new XText(s));
						}
					}
				}

	/*internal*/ void AddStringSkipNotify(s:string)
				{
					_validateString(s);
					if (content == null)
					{
						content = s;
					}
					else if (s.length > 0)
					{
						if (Types.isString(content))
						{
							content = <string>content + s;
						}
						else
						{
							var tn: XText = content as XText;
							if (tn != null && !(tn instanceof XCData))
							{
								tn.text += s;
							}
							else
							{
								AppendNodeSkipNotify(new XText(s));
							}
						}
					}
				}

	/*internal*/  AppendNode(n:XNode):void
				{
					var notify: boolean = NotifyChanging(n, XObjectChangeEventArgs.Add);
					if(n.parent != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
					AppendNodeSkipNotify(n);
					if(notify) NotifyChanged(n, XObjectChangeEventArgs.Add);
				}

	/*internal*/ void AppendNodeSkipNotify(n:XNode)
				{
					n.parent = this;
					if (content == null || Types.isString(content))
					{
						n._next = n;
					}
					else
					{
						var x: XNode = <XNode>content;
						n._next = x._next;
						x._next = n;
					}
					content = n;
				}

	/*internal*/ void AppendText(sb:StringBuilder)
				{
					var s: string = content as string;
					if (s != null)
					{
						sb.Append(s);
					}
					else
					{
						var n: XNode = <XNode>content;
						if (n != null)
						{
							do
							{
								n = n._next;
								n.AppendText(sb);
							} while (n != content);
						}
					}
				}

private GetTextOnly(): string
		{
			if (content == null) return null;
			var s: string = content as string;
			if (s == null)
			{
				var n: XNode = <XNode>content;
				do
				{
					n = n._next;
					if (n.NodeType != XmlNodeType.Text) return null;
					s += (<XText>n).Value;
				} while (n != content);
			}
			return s;
		}

		private CollectText(/*ref*/ n: XNode): string
		{
			var s: string = "";
			while (n != null && n.NodeType == XmlNodeType.Text)
			{
				s += (<XText>n).Value;
				n = n != content ? n._next : null;
			}
			return s;
		}

	/*internal*/  ContentsEqual(e: XContainer): boolean
		{
			if (content == e._content) return true;
			var s: string = GetTextOnly();
			if (s != null) return s == e.GetTextOnly();
			var n1: XNode = content as XNode;
			var n2: XNode = e._content as XNode;
			if (n1 != null && n2 != null)
			{
				n1 = n1._next;
				n2 = n2._next;
				while (true)
				{
					if (CollectText(n1:ref) != e.CollectText(n2:ref)) break;
					if (n1 == null && n2 == null) return true;
					if (n1 == null || n2 == null || !n1.DeepEquals(n2)) break;
					n1 = n1 != content ? n1._next : null;
					n2 = n2 != e._content ? n2._next : null;
				}
			}
			return false;
		}

	/*internal*/  ContentsHashCode(): number/*int*/
		{
			var s: string = GetTextOnly();
			if (s != null) return s.GetHashCode();
			var h: number/*int*/ = 0;
			var n: XNode = content as XNode;
			if (n != null)
			{
				do
				{
					n = n._next;
					var text: string = CollectText(n:ref);
					if (text.length > 0)
					{
						h ^= text.GetHashCode();
					}
					if (n == null) break;
					h ^= n.GetDeepHashCode();
				} while (n != content);
			}
			return h;
		}

	/*internal*/  ConvertTextToNode(): void
		{
			var s: string = content as string;
			if (s != null && s.length > 0)
			{
				var t: XText = new XText(s);
				t.parent = this;
				t._next = t;
				content = t;
			}
		}

	/*internal*/ static string GetDateTimeString(value:DateTime)
	{
		return XmlConvert.ToString(value, XmlDateTimeSerializationMode.RoundtripKind);
	}

	/*internal*/  GetDescendantNodes(self:boolean):IEnumerable < XNode >
	{
		if(self) yield return this;
		var n: XNode = this;
		while(true)
	{
		var c: XContainer = n as XContainer;
			private first: XNode;
		if (c != null && (first = c.FirstNode) != null)
		{
			n = first;
		}
		else
		{
			while (n != null && n != this && n == n.parent._content) n = n.parent;
			if (n == null || n == this) break;
			n = n._next;
		}
		yield return n;
	}
}

	/*internal*/  GetDescendants(name:XName, self:boolean):IEnumerable < XElement >
{
	if(self)
	{
		var e: XElement = <XElement>this;
		if (name == null || e.name == name) yield return e;
	}
	var n: XNode = this;
	var c: XContainer = this;
	while(true)
	{
	if (c != null && c._content instanceof XNode)
	{
		n = (<XNode>c._content)._next;
	}
				else
	{
		while (n != this && n == n.parent._content) n = n.parent;
		if (n == this) break;
		n = n._next;
	}
	var e: XElement = n as XElement;
	if (e != null && (name == null || e.name == name)) yield return e;
	c = e;
}
}

GetElements(name:XName):IEnumerable < XElement >
{
	var n: XNode = content as XNode;
	if(n != null)
	{
		do
		{
			n = n._next;
			var e: XElement = n as XElement;
			if (e != null && (name == null || e.name == name)) yield return e;
		} while (n.parent == this && n != content);
	}
}

	/*internal*/ static  GetStringValue(value:any):string
{
		private s: string;
	if (Types.isString(value))
	{
		s = <string>value;
	}
	else if (value instanceof double)
	{
		s = XmlConvert.ToString(<double>value);
	}
	else if (value instanceof float)
	{
		s = XmlConvert.ToString(<float>value);
	}
	else if (value instanceof decimal)
	{
		s = XmlConvert.ToString(<decimal>value);
	}
	else if (value instanceof boolean)
	{
		s = XmlConvert.ToString(<boolean>value);
	}
	else if (value instanceof DateTime)
	{
		s = GetDateTimeString(<DateTime>value);
	}
	else if (value instanceof DateTimeOffset)
	{
		s = XmlConvert.ToString(<DateTimeOffset>value);
	}
	else if (value instanceof TimeSpan)
	{
		s = XmlConvert.ToString(<TimeSpan>value);
	}
	else if (value instanceof XObject)
	{
		throw 'ArgumentException(Res.GetString(Res.Argument_XObjectValue))';
	}
	else
	{
		s = value.ToString();
	}
	if (s == null) throw 'ArgumentException(Res.GetString(Res.Argument_ConvertToString))';
	return s;
}

	/*internal*/  ReadContentFrom(r:XmlReader):void
{
	if(r.ReadState != ReadState.Interactive) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedInteractive))';
	var c: XContainer = this;
	var eCache: NamespaceCache = new NamespaceCache();
	var aCache: NamespaceCache = new NamespaceCache();
	do
	{
		switch(r.NodeType)
		{
			case XmlNodeType.Element:
		var e: XElement = new XElement(eCache.Get(r.NamespaceURI).GetName(r.LocalName));
		if(r.MoveToFirstAttribute())
		{
			do
			{
				e.AppendAttributeSkipNotify(new XAttribute(aCache.Get(r.Prefix.length == 0 ? string.Empty : r.NamespaceURI).GetName(r.LocalName), r.Value));
			} while (r.MoveToNextAttribute());
			r.MoveToElement();
		}
				c.AddNodeSkipNotify(e);
		if(!r.IsEmptyElement)
{
	c = e;
}
break;
			case XmlNodeType.EndElement:
if (c._content == null)
{
	c._content = string.Empty;
}
if (c == this) return;
c = c.parent;
break;
			case XmlNodeType.Text:
			case XmlNodeType.SignificantWhitespace:
			case XmlNodeType.Whitespace:
c.AddStringSkipNotify(r.Value);
break;
			case XmlNodeType.CDATA:
c.AddNodeSkipNotify(new XCData(r.Value));
break;
			case XmlNodeType.Comment:
c.AddNodeSkipNotify(new XComment(r.Value));
break;
			case XmlNodeType.ProcessingInstruction:
c.AddNodeSkipNotify(new XProcessingInstruction(r.Name, r.Value));
break;
			case XmlNodeType.DocumentType:
c.AddNodeSkipNotify(new XDocumentType(r.LocalName, r.GetAttribute("PUBLIC"), r.GetAttribute("SYSTEM"), r.Value, r.DtdInfo));
break;
			case XmlNodeType.EntityReference:
if (!r.CanResolveEntity) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnresolvedEntityReference))';
r.ResolveEntity();
break;
			case XmlNodeType.EndEntity:
break;
			default:
throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnexpectedNodeType, r.NodeType))';
		}
	} while (r.Read());
}

	/*internal*/  ReadContentFrom(r:XmlReader, o:LoadOptions):void
{
	if((o & (LoadOptions.SetBaseUri | LoadOptions.SetLineInfo)) == 0)
{
	ReadContentFrom(r);
	return;
}
if (r.ReadState != ReadState.Interactive) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedInteractive))';
var c: XContainer = this;
var n: XNode = null;
var eCache: NamespaceCache = new NamespaceCache();
var aCache: NamespaceCache = new NamespaceCache();
var baseUri: string = (o & LoadOptions.SetBaseUri) != 0 ? r.BaseURI : null;
var li: IXmlLineInfo = (o & LoadOptions.SetLineInfo) != 0 ? r as IXmlLineInfo : null;
do
{
	var uri: string = r.BaseURI;
	switch (r.NodeType)
	{
		case XmlNodeType.Element:
			{
				var e: XElement = new XElement(eCache.Get(r.NamespaceURI).GetName(r.LocalName));
				if (baseUri != null && baseUri != uri)
				{
					e.SetBaseUri(uri);
				}
				if (li != null && li.HasLineInfo())
				{
					e.SetLineInfo(li.LineNumber, li.LinePosition);
				}
				if (r.MoveToFirstAttribute())
				{
					do
					{
						var a: XAttribute = new XAttribute(aCache.Get(r.Prefix.length == 0 ? string.Empty : r.NamespaceURI).GetName(r.LocalName), r.Value);
						if (li != null && li.HasLineInfo())
						{
							a.SetLineInfo(li.LineNumber, li.LinePosition);
						}
						e.AppendAttributeSkipNotify(a);
					} while (r.MoveToNextAttribute());
					r.MoveToElement();
				}
				c.AddNodeSkipNotify(e);
				if (!r.IsEmptyElement)
				{
					c = e;
					if (baseUri != null)
					{
						baseUri = uri;
					}
				}
				break;
			}
		case XmlNodeType.EndElement:
			{
				if (c._content == null)
				{
					c._content = string.Empty;
				}
				// Store the line info of the end element tag.
				// Note that since we've got EndElement the current container must be an XElement
				var e: XElement = c as XElement;
				Debug.Assert(e != null, "EndElement recieved but the current container instanceof not an element.");
				if (e != null && li != null && li.HasLineInfo())
				{
					e.SetEndElementLineInfo(li.LineNumber, li.LinePosition);
				}
				if (c == this) return;
				if (baseUri != null && c.HasBaseUri)
				{
					baseUri = c.parent.BaseUri;
				}
				c = c.parent;
				break;
			}
		case XmlNodeType.Text:
		case XmlNodeType.SignificantWhitespace:
		case XmlNodeType.Whitespace:
			if ((baseUri != null && baseUri != uri) ||
				(li != null && li.HasLineInfo()))
			{
				n = new XText(r.Value);
			}
			else
			{
				c.AddStringSkipNotify(r.Value);
			}
			break;
		case XmlNodeType.CDATA:
			n = new XCData(r.Value);
			break;
		case XmlNodeType.Comment:
			n = new XComment(r.Value);
			break;
		case XmlNodeType.ProcessingInstruction:
			n = new XProcessingInstruction(r.Name, r.Value);
			break;
		case XmlNodeType.DocumentType:
			n = new XDocumentType(r.LocalName, r.GetAttribute("PUBLIC"), r.GetAttribute("SYSTEM"), r.Value, r.DtdInfo);
			break;
		case XmlNodeType.EntityReference:
			if (!r.CanResolveEntity) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnresolvedEntityReference))';
			r.ResolveEntity();
			break;
		case XmlNodeType.EndEntity:
			break;
		default:
			throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnexpectedNodeType, r.NodeType))';
	}
	if (n != null)
	{
		if (baseUri != null && baseUri != uri)
		{
			n.SetBaseUri(uri);
		}
		if (li != null && li.HasLineInfo())
		{
			n.SetLineInfo(li.LineNumber, li.LinePosition);
		}
		c.AddNodeSkipNotify(n);
		n = null;
	}
} while (r.Read());
}

	/*internal*/  RemoveNode(n:XNode):void
{
	var notify: boolean = NotifyChanging(n, XObjectChangeEventArgs.Remove);
	if(n.parent != this) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
	var p: XNode = <XNode>content;
	while(p._next != n) p = p._next;
	if(p == n)
	{
		content = null;
	}
	else
	{
		if(content == n) content = p;
		p._next = n._next;
	}
	n.parent = null;
	n._next = null;
	if(notify) NotifyChanged(n, XObjectChangeEventArgs.Remove);
}

private RemoveNodesSkipNotify():void
{
	var n: XNode = content as XNode;
	if(n != null)
	{
		do
		{
			var next: XNode = n._next;
			n.parent = null;
			n._next = null;
			n = next;
		} while (n != content);
	}
	content = null;
}



	/*internal*/  WriteContentTo(writer:XmlWriter):void
{
	if(content != null)
	{
		if (Types.isString(content))
		{
			if (this instanceof XDocument)
			{
				writer.WriteWhitespace(<string>content);
			}
			else
			{
				writer.WriteString(<string>content);
			}
		}
		else
		{
			var n: XNode = <XNode>content;
			do
			{
				n = n._next;
				n.WriteTo(writer);
			} while (n != content);
		}
	}
}

		static  AddContentToList(list:List<object> , content:any):void
	{
		var e: IEnumerable = Types.isString(content) ? null : content as IEnumerable;
if (e == null)
{
	list.Add(content);
}
else
{
	foreach(object obj in e)
	{
		if (obj != null) AddContentToList(list, obj);
	}
}
}

		static /*internal*/  GetContentSnapshot(content:any):any
{
	if (content instanceof string || !(content instanceof IEnumerable)) return content;
	List < object > list = new List<any>();
	AddContentToList(list, content);
	return list;
}
}