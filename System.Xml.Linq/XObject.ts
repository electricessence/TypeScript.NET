///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Xml.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.linq.xobject(v=vs.110).aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	import IXmlLineInfo = System.Xml.IXmlLineInfo;
	import XmlNodeType = System.Xml.XmlNodeType;
	import EventDispatcher = System.EventDispatcher;

	import Enumerable = System.Linq.Enumerable;

	import isNullOrUndefined = System.isNullOrUndefined;

	var EMPTY:string = "";

	class BaseUriAnnotation
	{
		baseUri:string;

		constructor(baseUri:string)
		{
			this.baseUri = baseUri;
		}
	}

	export class XObject
		extends System.EventDispatcher
		implements System.Xml.IXmlLineInfo
	{
		public static EVENT_CHANGED = "changed";
		public static EVENT_CHANGING = "changing";

		private _annotations: any;

		constructor()
		{
			super();
		}

		/// <summary>
		/// Get the BaseUri for this <see cref="XObject"/>.
		/// </summary>
		get baseUri(): string
		{
			var o = this;
			while (true)
			{
				while (o != null && o.annotations == null)
				{
					o = o.parent;
				}
				if (o == null) break;
				var a = o.annotation<BaseUriAnnotation>();
				if (a != null) return a.baseUri;
				o = o.parent;
			}
			return EMPTY;
		}


		get document(): XDocument
		{
			var n: XObject = this;
			while (n.parent != null) n = n.parent;

			return n && n.nodeType === XmlNodeType.Document ? <XDocument>n : null;
		}

		getNodeType(): XmlNodeType
		{
			return XmlNodeType.None;
		}

		get nodeType(): XmlNodeType
		{
			return this.getNodeType();
		}


		private _parent: XElement;
		// Internal
		__setParent(parent: XElement): void
		{
			this._parent = parent;
		}

		// See line 1060 of System.Xml.Linq/XLinq.cs
		/// <summary>
		/// Adds an object to the annotation list of this <see cref="XObject"/>.
		/// </summary>
		/// <param name="annotation">The annotation to add.</param>
		addAnnotation(annotation:any): void
		{
			if (isNullOrUndefined(annotation))
				throw 'ArgumentNullException("annotation")';

			// Herein lies a method of memory optimization.
			// _annotations is not initialized unless used. 
			// And arrays are not used unless needed.

			var a: any = this._annotations;
			if (isNullOrUndefined(a))
			{
				// Not initialzied yet?
				this._annotations =
					annotation instanceof Array
					? [annotation] // Create a wrapping array to ensure the outer collection isn't confused.
					: annotation; // Not an array?  Ok go ahead with a single value.
			}
			else
			{
				if (a instanceof Array)
					a.push(annotation);
				else
					this._annotations = [a, annotation];
			}
		}


		private _lineNumber:number;
		protected _setLineNumber(lineNumber:number):void{
			this._lineNumber = lineNumber;
		}

		get lineNumber(): number  // int
		{
			return this._lineNumber;
		}

		private _linePosition:number;
		protected _setLinePosition(linePosition:number):void{
			this._linePosition = linePosition;
		}

		get linePosition(): number  // int
		{
			return this._linePosition;
		}

		hasLineInfo(): boolean
		{
			return !isNaN(this._lineNumber) && !isNaN(this._linePosition);
		}








		get parent(): XElement
		{
			return this._parent;
		}

		removeAnnotations(type?:any):void
		{
			var a = this._annotationsArray;
			if (!type) a.length = 0;
			else
			{
				var i: number = 0 | 0;
				for (var i = a.length - 1; i >= 0; i--)
				{
					if (a[i].Type === type)
					{
						a.splice(i, 1);
					}
				}
			}
		}

		annotation<T>(type?: any): T
		{
			return this._annotationsEnumerable
				.where(a=> a.Type === type)
				.select(a=> a.Object)
				.firstOrDefault();
		}

		annotations<T>(type?: any):Enumerable<T>
		{
			var e = this._annotationsEnumerable;
			if (type)
				e = e.where(a=> a.Type === type);

			return e.select(a=> a.Object);
		}

		

	}
}

